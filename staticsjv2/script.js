// =====================================================
// CONFIGURATION - Gets from config.js
// =====================================================
const DEFAULT_WISP = window.SITE_CONFIG?.defaultWisp ?? "wss://glseries.net/wisp/";
const WISP_SERVERS = window.SITE_CONFIG?.wispServers?.length
    ? window.SITE_CONFIG.wispServers
    : [{ name: "GLSeries", url: "wss://glseries.net/wisp/" }];

// Initialize default proxy server if not set
if (!localStorage.getItem("proxServer")) {
    localStorage.setItem("proxServer", DEFAULT_WISP);
}

// Helper to get all servers (config + custom)
function getAllWispServers() {
    const customWisps = getStoredWisps();
    return [...WISP_SERVERS, ...customWisps];
}

// =====================================================
// PROACTIVE SERVER HEALTH CHECKING
// =====================================================

// Ping a wisp server to check if it's responsive
async function pingWispServer(url, timeout = 2000) {
    return new Promise((resolve) => {
        const start = Date.now();
        try {
            const ws = new WebSocket(url);
            const timer = setTimeout(() => {
                try { ws.close(); } catch {}
                resolve({ url, success: false, latency: null });
            }, timeout);

            ws.onopen = () => {
                clearTimeout(timer);
                const latency = Date.now() - start;
                try { ws.close(); } catch {}
                resolve({ url, success: true, latency });
            };

            ws.onerror = () => {
                clearTimeout(timer);
                try { ws.close(); } catch {}
                resolve({ url, success: false, latency: null });
            };
        } catch {
            resolve({ url, success: false, latency: null });
        }
    });
}

// Find the best (fastest working) server from the list
async function findBestWispServer(servers, currentUrl) {
    if (!servers || servers.length === 0) return currentUrl;

    // Ping all servers in parallel (faster than sequential)
    const results = await Promise.all(
        servers.map(s => pingWispServer(s.url, 2000))
    );

    // Filter to only working servers and sort by latency
    const working = results
        .filter(r => r.success)
        .sort((a, b) => a.latency - b.latency);

    if (working.length > 0) {
        return working[0].url;
    }

    // If none working, return current or first
    return currentUrl || servers[0]?.url;
}

// Proactively check and switch to best server on init
async function initializeWithBestServer() {
    const autoswitch = localStorage.getItem('wispAutoswitch') !== 'false';
    const allServers = getAllWispServers();

    if (!autoswitch || allServers.length <= 1) {
        return;
    }

    const currentUrl = localStorage.getItem("proxServer") || DEFAULT_WISP;
    
    // Check if current server is working, if not find a better one
    const currentCheck = await pingWispServer(currentUrl, 2000);
    
    if (currentCheck.success) {
        console.log("Init: Current server is working:", currentUrl, currentCheck.latency + "ms");
        return;
    }

    // Current server is bad, find the fastest working server
    console.log("Init: Current server not responding, finding better server...");
    const best = await findBestWispServer(allServers, currentUrl);
    
    if (best && best !== currentUrl) {
        console.log("Init: Auto-switching to faster server:", best);
        localStorage.setItem("proxServer", best);
        const serverName = allServers.find(s => s.url === best)?.name || 'Faster Server';
        notify('info', 'Auto-switched', `Using ${serverName} for best performance`);
    }
}

// =====================================================
// BROWSER STATE
// =====================================================
const BareMux = window.BareMux ?? { BareMuxConnection: class { setTransport() {} } };

// SINGLETON: Shared resources for all tabs (prevents connection exhaustion)
let sharedScramjet = null;
let sharedConnection = null;
let sharedConnectionReady = false;

let tabs = [];
let activeTabId = null;
let nextTabId = 1;

// =====================================================
// UTILITIES
// =====================================================
const getBasePath = () => {
    const basePath = location.pathname.replace(/[^/]*$/, '');
    return basePath.endsWith('/') ? basePath : basePath + '/';
};

const getStoredWisps = () => {
    try { return JSON.parse(localStorage.getItem('customWisps') ?? '[]'); }
    catch { return []; }
};

const getActiveTab = () => tabs.find(t => t.id === activeTabId);

const notify = (type, title, message) => {
    if (typeof Notify !== 'undefined') {
        Notify[type](title, message);
    }
};

// =====================================================
// INITIALIZATION
// =====================================================
async function getSharedScramjet() {
    if (sharedScramjet) return sharedScramjet;

    const basePath = getBasePath();
    const { ScramjetController } = $scramjetLoadController();
    
    sharedScramjet = new ScramjetController({
        prefix: basePath + "scramjet/",
        files: {
            wasm: "https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.wasm.wasm",
            all: "https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.all.js",
            sync: "https://cdn.jsdelivr.net/gh/Destroyed12121/Staticsj@main/JS/scramjet.sync.js"
        }
    });
    
    try {
        await sharedScramjet.init();
    } catch (err) {
        // Handle IndexedDB schema errors by clearing cache and retrying
        if (err.message && err.message.includes('IDBDatabase') || err.message && err.message.includes('object stores')) {
            console.warn('Scramjet IndexedDB error, clearing cache and retrying...');
            
            // Clear IndexedDB for Scramjet
            try {
                const dbNames = ['scramjet-data', 'scrambase', 'ScramjetData'];
                for (const dbName of dbNames) {
                    const req = indexedDB.deleteDatabase(dbName);
                    req.onsuccess = () => console.log(`Cleared IndexedDB: ${dbName}`);
                    req.onerror = () => console.warn(`Failed to clear IndexedDB: ${dbName}`);
                }
            } catch (clearErr) {
                console.warn('Failed to clear IndexedDB:', clearErr);
            }
            
            // Reset shared instance and retry
            sharedScramjet = null;
            return getSharedScramjet();
        }
        throw err;
    }
    
    return sharedScramjet;
}

async function getSharedConnection() {
    if (sharedConnectionReady) return sharedConnection;

    const basePath = getBasePath();
    const wispUrl = localStorage.getItem("proxServer") ?? DEFAULT_WISP;
    
    sharedConnection = new BareMux.BareMuxConnection(basePath + "bareworker.js");
    await sharedConnection.setTransport(
        "https://cdn.jsdelivr.net/npm/@mercuryworkshop/epoxy-transport@2.1.28/dist/index.mjs",
        [{ wisp: wispUrl }]
    );
    sharedConnectionReady = true;
    return sharedConnection;
}

async function initializeBrowser() {
    const root = document.getElementById("app");
    root.innerHTML = `
        <div class="browser-container">
            <div class="flex tabs" id="tabs-container"></div>
            <div class="flex nav">
                <button id="back-btn" title="Back"><i class="fa-solid fa-chevron-left"></i></button>
                <button id="fwd-btn" title="Forward"><i class="fa-solid fa-chevron-right"></i></button>
                <button id="reload-btn" title="Reload"><i class="fa-solid fa-rotate-right"></i></button>
                <div class="address-wrapper">
                    <input class="bar" id="address-bar" autocomplete="off" placeholder="Search or enter URL">
                    <button id="home-btn-nav" title="Home"><i class="fa-solid fa-house"></i></button>
                </div>
                <button id="devtools-btn" title="DevTools"><i class="fa-solid fa-code"></i></button>
                <button id="wisp-settings-btn" title="Proxy Settings"><i class="fa-solid fa-gear"></i></button>
            </div>
            <div class="loading-bar-container"><div class="loading-bar" id="loading-bar"></div></div>
            <div class="iframe-container" id="iframe-container">
                <div id="loading" class="message-container" style="display: none;">
                    <div class="message-content">
                        <div class="spinner"></div>
                        <h1 id="loading-title">Connecting</h1>
                        <p id="loading-url">Initializing proxy...</p>
                        <button id="skip-btn">Skip</button>
                    </div>
                </div>
                <div id="error" class="message-container" style="display: none;">
                    <div class="message-content">
                        <h1>Connection Error</h1>
                        <p id="error-message">An error occurred.</p>
                    </div>
                </div>
            </div>
        </div>`;

    // Cache DOM elements
    const elements = {
        backBtn: document.getElementById('back-btn'),
        fwdBtn: document.getElementById('fwd-btn'),
        reloadBtn: document.getElementById('reload-btn'),
        addrBar: document.getElementById('address-bar'),
        skipBtn: document.getElementById('skip-btn')
    };

    // Bind navigation events
    elements.backBtn.onclick = () => getActiveTab()?.frame.back();
    elements.fwdBtn.onclick = () => getActiveTab()?.frame.forward();
    elements.reloadBtn.onclick = () => getActiveTab()?.frame.reload();
    document.getElementById('home-btn-nav').onclick = () => window.location.href = '../index.html';
    document.getElementById('devtools-btn').onclick = toggleDevTools;
    document.getElementById('wisp-settings-btn').onclick = openSettings;

    // Skip button logic
    elements.skipBtn.onclick = () => {
        const tab = getActiveTab();
        if (tab) {
            tab.loading = false;
            showIframeLoading(false);
        }
    };

    // Address bar events
    elements.addrBar.onkeyup = (e) => e.key === 'Enter' && handleSubmit();
    elements.addrBar.onfocus = () => elements.addrBar.select();

    // Handle navigation messages
    window.addEventListener('message', (e) => {
        if (e.data?.type === 'navigate') handleSubmit(e.data.url);
    });

    createTab(true);
    checkHashParameters();
}

// =====================================================
// TAB MANAGEMENT
// =====================================================
function createTab(makeActive = true) {
    const frame = sharedScramjet.createFrame();
    const tab = {
        id: nextTabId++,
        title: "New Tab",
        url: "NT.html",
        frame,
        loading: false,
        favicon: null,
        skipTimeout: null,
        loadStartTime: null
    };

    frame.frame.src = "NT.html";

    frame.addEventListener("urlchange", (e) => {
        tab.url = e.url;
        tab.loading = true;
        tab.loadStartTime = Date.now();

        if (tab.id === activeTabId) {
            showIframeLoading(true, tab.url);
        }

        try {
            const urlObj = new URL(e.url);
            tab.title = urlObj.hostname;
            tab.favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=32`;
        } catch {
            tab.title = "Browsing";
            tab.favicon = null;
        }
        
        updateTabsUI();
        updateAddressBar();
        updateLoadingBar(tab, 10);

        if (tab.skipTimeout) clearTimeout(tab.skipTimeout);
        tab.skipTimeout = setTimeout(() => {
            if (tab.loading && tab.id === activeTabId) {
                document.getElementById('skip-btn')?.style.setProperty('display', 'inline-block');
            }
        }, 200);
    });

    frame.frame.addEventListener('load', () => {
        tab.loading = false;
        clearTimeout(tab.skipTimeout);

        if (tab.id === activeTabId) {
            showIframeLoading(false);
        }

        try {
            const title = frame.frame.contentWindow.document.title;
            if (title) tab.title = title;
        } catch { }

        if (frame.frame.contentWindow.location.href.includes('NT.html')) {
            tab.title = "New Tab";
            tab.url = "";
            tab.favicon = null;
        }

        updateTabsUI();
        updateAddressBar();
        updateLoadingBar(tab, 100);
    });

    tabs.push(tab);
    document.getElementById("iframe-container").appendChild(frame.frame);
    if (makeActive) switchTab(tab.id);
    return tab;
}

function showIframeLoading(show, url = '') {
    const loader = document.getElementById("loading");
    if (!loader) return;

    loader.style.display = show ? "flex" : "none";
    getActiveTab()?.frame.frame.classList.toggle('loading', show);

    if (show) {
        document.getElementById("loading-title").textContent = "Connecting";
        document.getElementById("loading-url").textContent = url || "Loading content...";
        document.getElementById("skip-btn").style.display = 'none';
    }
}

function switchTab(tabId) {
    activeTabId = tabId;
    const tab = getActiveTab();

    tabs.forEach(t => t.frame.frame.classList.toggle("hidden", t.id !== tabId));

    if (tab) {
        showIframeLoading(tab.loading, tab.url);
        
        const skipBtn = document.getElementById('skip-btn');
        if (tab.loading && tab.loadStartTime && skipBtn) {
            const elapsed = Date.now() - tab.loadStartTime;
            if (elapsed > 3000) skipBtn.style.display = 'inline-block';
        }
    }

    updateTabsUI();
    updateAddressBar();
}

function closeTab(tabId) {
    const idx = tabs.findIndex(t => t.id === tabId);
    if (idx === -1) return;

    const tab = tabs[idx];
    clearTimeout(tab.skipTimeout);
    
    if (tab.frame?.frame) {
        tab.frame.frame.src = 'about:blank';
        tab.frame.frame.remove();
    }
    
    tabs.splice(idx, 1);

    if (activeTabId === tabId) {
        if (tabs.length > 0) switchTab(tabs[Math.max(0, idx - 1)].id);
        else window.location.reload();
    } else {
        updateTabsUI();
    }
}

function updateTabsUI() {
    const container = document.getElementById("tabs-container");
    container.innerHTML = "";

    tabs.forEach(tab => {
        const el = document.createElement("div");
        el.className = `tab ${tab.id === activeTabId ? "active" : ""}`;

        const iconHtml = tab.loading 
            ? `<div class="tab-spinner"></div>`
            : tab.favicon 
                ? `<img src="${tab.favicon}" class="tab-favicon" onerror="this.style.display='none'">`
                : '';

        el.innerHTML = `${iconHtml}<span class="tab-title">${tab.title}</span><span class="tab-close">&times;</span>`;
        el.onclick = () => switchTab(tab.id);
        el.querySelector(".tab-close").onclick = (e) => { e.stopPropagation(); closeTab(tab.id); };
        container.appendChild(el);
    });

    const newBtn = document.createElement("button");
    newBtn.className = "new-tab";
    newBtn.innerHTML = "<i class='fa-solid fa-plus'></i>";
    newBtn.onclick = () => createTab(true);
    container.appendChild(newBtn);
}

function updateAddressBar() {
    const bar = document.getElementById("address-bar");
    const tab = getActiveTab();
    if (bar && tab) {
        bar.value = (tab.url && !tab.url.includes("NT.html")) ? tab.url : "";
    }
}

function handleSubmit(url) {
    const tab = getActiveTab();
    let input = url ?? document.getElementById("address-bar").value.trim();
    if (!input) return;

    if (!input.startsWith('http')) {
        input = input.includes('.') && !input.includes(' ') 
            ? `https://${input}`
            : `https://search.brave.com/search?q=${encodeURIComponent(input)}`;
    }
    
    tab.loading = true;
    showIframeLoading(true, input);
    updateLoadingBar(tab, 10);
    tab.frame.go(input);
}

function updateLoadingBar(tab, percent) {
    if (tab.id !== activeTabId) return;
    const bar = document.getElementById("loading-bar");
    bar.style.width = percent + "%";
    bar.style.opacity = percent === 100 ? "0" : "1";
    if (percent === 100) setTimeout(() => { bar.style.width = "0%"; }, 200);
}

// =====================================================
// SETTINGS & WISP
// =====================================================
function openSettings() {
    const modal = document.getElementById('wisp-settings-modal');
    modal.classList.remove('hidden');

    document.getElementById('close-wisp-modal').onclick = () => modal.classList.add('hidden');
    document.getElementById('save-custom-wisp').onclick = saveCustomWisp;

    modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
    renderServerList();
}

function renderServerList() {
    const list = document.getElementById('server-list');
    list.innerHTML = '';

    const currentUrl = localStorage.getItem('proxServer') ?? DEFAULT_WISP;
    const allWisps = [...WISP_SERVERS, ...getStoredWisps()];

    allWisps.forEach((server, index) => {
        const isActive = server.url === currentUrl;
        const isCustom = index >= WISP_SERVERS.length;

        const item = document.createElement('div');
        item.className = `wisp-option ${isActive ? 'active' : ''}`;

        const deleteBtn = isCustom
            ? `<button class="delete-wisp-btn" onclick="event.stopPropagation(); deleteCustomWisp('${server.url}')"><i class="fa-solid fa-trash"></i></button>`
            : '';

        item.innerHTML = `
            <div class="wisp-option-header">
                <div class="wisp-option-name">
                    ${server.name}
                    ${isActive ? '<i class="fa-solid fa-check" style="margin-left:8px; font-size: 0.7em; color: var(--accent);"></i>' : ''}
                </div>
                <div class="server-status">
                    <span class="ping-text">...</span>
                    <div class="status-indicator"></div>
                    ${deleteBtn}
                </div>
            </div>
            <div class="wisp-option-url">${server.url}</div>
        `;

        item.onclick = () => setWisp(server.url);
        list.appendChild(item);
        checkServerHealth(server.url, item);
    });

    // Add Autoswitch Toggle
    const isAutoswitch = localStorage.getItem('wispAutoswitch') !== 'false';
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'wisp-option';
    toggleContainer.style.cssText = 'margin-top: 10px; cursor: default;';
    toggleContainer.innerHTML = `
        <div class="wisp-option-header" style="justify-content: space-between;">
            <div class="wisp-option-name"><i class="fa-solid fa-rotate" style="margin-right:8px"></i> Auto-switch on failure</div>
            <div class="toggle-switch ${isAutoswitch ? 'active' : ''}" id="autoswitch-toggle">
                <div class="toggle-knob"></div>
            </div>
        </div>
    `;

    toggleContainer.onclick = () => {
        const newState = !isAutoswitch;
        localStorage.setItem('wispAutoswitch', newState);
        document.getElementById('autoswitch-toggle').classList.toggle('active', newState);

        navigator.serviceWorker.controller?.postMessage({ type: 'config', autoswitch: newState });
        notify('success', 'Settings Saved', `Autoswitch ${newState ? 'Enabled' : 'Disabled'}`);
        location.reload();
    };

    list.appendChild(toggleContainer);
}

function saveCustomWisp() {
    const input = document.getElementById('custom-wisp-input');
    const url = input.value.trim();

    if (!url) return;
    if (!url.startsWith('ws://') && !url.startsWith('wss://')) {
        notify('error', 'Invalid URL', 'URL must start with wss:// or ws://');
        return;
    }

    const customWisps = getStoredWisps();
    if (customWisps.some(w => w.url === url) || WISP_SERVERS.some(w => w.url === url)) {
        notify('warning', 'Already Exists', 'This server is already in the list.');
        return;
    }

    const newServer = { name: `Custom ${customWisps.length + 1}`, url };
    customWisps.push(newServer);
    localStorage.setItem('customWisps', JSON.stringify(customWisps));
    
    // Switch to the newly added server
    setWisp(url);
    
    input.value = '';
}

window.deleteCustomWisp = function (urlToDelete) {
    if (!confirm("Remove this server?")) return;

    let customWisps = getStoredWisps().filter(w => w.url !== urlToDelete);
    localStorage.setItem('customWisps', JSON.stringify(customWisps));

    if (localStorage.getItem('proxServer') === urlToDelete) {
        setWisp(DEFAULT_WISP);
    } else {
        renderServerList();
    }
};

async function checkServerHealth(url, element) {
    const dot = element.querySelector('.status-indicator');
    const text = element.querySelector('.ping-text');
    const start = Date.now();

    const markOffline = () => {
        dot.classList.add('status-error');
        text.textContent = "Offline";
    };

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        
        await fetch(url.replace('wss://', 'https://').replace('/wisp/', '/health') || url, {
            method: 'HEAD',
            signal: controller.signal,
            mode: 'no-cors'
        });
        
        clearTimeout(timeout);
        dot.classList.add('status-success');
        text.textContent = `${Date.now() - start}ms`;
    } catch {
        // Fallback: quick WebSocket test
        try {
            const wsTest = new WebSocket(url);
            wsTest.onopen = () => {
                dot.classList.add('status-success');
                text.textContent = `${Date.now() - start}ms`;
                wsTest.close();
            };
            wsTest.onerror = markOffline;
            
            setTimeout(() => {
                if (wsTest.readyState !== WebSocket.OPEN) {
                    wsTest.close();
                    markOffline();
                }
            }, 1000);
        } catch { markOffline(); }
    }
}

function setWisp(url) {
    const oldUrl = localStorage.getItem('proxServer');
    localStorage.setItem('proxServer', url);

    if (oldUrl !== url) {
        const serverName = [...WISP_SERVERS, ...getStoredWisps()].find(s => s.url === url)?.name ?? 'Custom Server';
        notify('success', 'Proxy Changed', `Switching to ${serverName}...`);
    }

    navigator.serviceWorker.controller?.postMessage({ type: 'config', wispurl: url });
    setTimeout(() => location.reload(), 600);
}

// =====================================================
// UTILITIES
// =====================================================
function toggleDevTools() {
    const win = getActiveTab()?.frame.frame.contentWindow;
    if (!win) return;
    if (win.eruda) {
        win.eruda.show();
        return;
    }
    const script = win.document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/eruda";
    script.onload = () => { win.eruda.init(); win.eruda.show(); };
    win.document.body.appendChild(script);
}

async function checkHashParameters() {
    if (window.location.hash) {
        const hash = decodeURIComponent(window.location.hash.substring(1));
        if (hash) handleSubmit(hash);
        history.replaceState(null, null, location.pathname);
    }
}

// =====================================================
// MAIN INITIALIZATION
// =====================================================
document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Proactively find the best server before initializing
        await initializeWithBestServer();
        
        await getSharedScramjet();
        await getSharedConnection();

        if ('serviceWorker' in navigator) {
            const reg = await navigator.serviceWorker.register(getBasePath() + 'sw.js', { scope: getBasePath() });
            
            // Wait for SW to be ready
            await navigator.serviceWorker.ready;
            
            const wispUrl = localStorage.getItem("proxServer") ?? DEFAULT_WISP;
            const allServers = getAllWispServers();
            const autoswitch = localStorage.getItem('wispAutoswitch') !== 'false';
            
            const swConfig = {
                type: "config",
                wispurl: wispUrl,
                servers: allServers,
                autoswitch: autoswitch
            };

            // Send config to SW
            const sendConfig = async () => {
                const sw = reg.active || navigator.serviceWorker.controller;
                if (sw) {
                    console.log("Sending config to SW:", swConfig);
                    sw.postMessage(swConfig);
                }
            };

            // Try sending immediately, then retry if needed
            sendConfig();
            setTimeout(sendConfig, 500);
            setTimeout(sendConfig, 1500);

            navigator.serviceWorker.addEventListener('message', (event) => {
                const { type, url, name, message } = event.data;
                if (type === 'wispChanged') {
                    console.log("SW reported Wisp Change:", event.data);
                    localStorage.setItem("proxServer", url);
                    notify('info', 'Autoswitched Proxy', `Now using ${name} because the previous server was slow or offline.`);
                } else if (type === 'wispError') {
                    console.error("SW reported Wisp Error:", event.data);
                    notify('error', 'Proxy Error', message);
                }
            });

            reg.update();
        }

        await initializeBrowser();
    } catch (err) {
        console.error("Initialization error:", err);
    }
});
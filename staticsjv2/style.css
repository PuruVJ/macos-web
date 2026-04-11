/* Browser Styles */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

:root {
    /* Core colors (can be overridden by user settings) */
    --bg: #0a0a0a;
    --surface: #0f0f0f;
    --surface-hover: #1a1a1a;
    --surface-active: #252525;
    --border: #1f1f1f;
    --border-light: #2a2a2a;

    /* Text */
    --text: #e4e4e7;
    --text-muted: #71717a;
    --text-dim: #52525b;

    /* Accent (customizable) */
    --accent: #ffffff;
    --accent-dim: rgba(255, 255, 255, 0.8);
    --accent-glow: rgba(255, 255, 255, 0.1);

    /* Status colors */
    --success: #22c55e;
    --warning: #f59e0b;
    --error: #ef4444;
    --info: #3b82f6;

    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.4);
    --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.5);
    --shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.6);

    /* Spacing */
    --space-xs: 4px;
    --space-sm: 8px;
    --space-md: 16px;
    --space-lg: 24px;
    --space-xl: 32px;
    --space-2xl: 48px;

    /* Border radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;

    /* Transitions */
    --transition-fast: 0.1s ease;
    --transition-normal: 0.2s ease;
    --transition-slow: 0.3s ease;

    /* Z-index layers */
    --z-base: 1;
    --z-dropdown: 100;
    --z-sticky: 500;
    --z-modal: 1000;
    --z-toast: 2000;
    --z-max: 9999;

    /* Typography */
    --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
    --font-mono: 'JetBrains Mono', 'Fira Code', monospace;

    /* Background (customizable) */
    --bg-image: none;
}

*,
*::before,
*::after {
    box-sizing: border-box;
}

body,
html,
#app {
    font-family: 'Inter', system-ui, sans-serif;
    width: 100vw;
    height: 100vh;
    margin: 0;
    background: var(--bg);
    overflow: hidden;
    color: var(--text);
}

/* Layout */
.browser-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
}

/* Tabs */
.tabs {
    display: flex;
    padding: 8px 8px 0;
    gap: 4px;
    background: var(--bg);
    overflow-x: auto;
}

.tabs::-webkit-scrollbar {
    height: 0;
}

.tab {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    min-width: 180px;
    max-width: 220px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
    cursor: pointer;
    transition: background 0.15s;
}

.tab:hover {
    background: var(--surface-hover);
}

.tab.active {
    background: var(--surface-hover);
    border-color: var(--border-light);
}

.tab-favicon {
    width: 16px;
    height: 16px;
    border-radius: 2px;
    flex-shrink: 0;
}

.tab-title {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.tab-close {
    font-size: 16px;
    color: var(--text-muted);
    cursor: pointer;
    padding: 2px;
    border-radius: 4px;
    transition: all 0.15s;
    line-height: 1;
}

.tab-close:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text);
}

.new-tab {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.15s;
    font-size: 14px;
    flex-shrink: 0;
    margin-top: 4px;
}

.new-tab:hover {
    background: var(--surface);
    color: var(--text);
}

/* Navigation Bar */
.nav {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px;
    background: var(--bg);
}

.nav button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    background: var(--surface);
    border: none;
    border-radius: 8px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.15s;
    font-size: 14px;
}

.nav button:hover {
    background: var(--surface-hover);
    color: var(--text);
}

/* Address Bar Wrapper */
.address-wrapper {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
}

input.bar {
    width: 100%;
    height: 36px;
    padding: 0 40px 0 14px;
    /* Padding right for home button */
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 13px;
    font-family: inherit;
    outline: none;
    transition: all 0.15s;
}

input.bar:focus {
    border-color: var(--border-light);
    background: var(--surface-hover);
}

input.bar::placeholder {
    color: var(--text-muted);
}

#home-btn-nav {
    position: absolute;
    right: 4px;
    width: 28px;
    height: 28px;
    background: transparent;
    border: none;
    color: var(--text-muted);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    padding: 0;
}

#home-btn-nav:hover {
    color: var(--text);
    background: var(--surface-hover);
}

/* Loading Bar */
.loading-bar-container {
    height: 2px;
    background: transparent;
}

.loading-bar {
    height: 100%;
    width: 0%;
    background: var(--text);
    transition: width 0.2s ease, opacity 0.15s;
}

/* Iframe */
.iframe-container {
    flex: 1;
    position: relative;
    background: var(--bg);
}

.iframe-container iframe {
    width: 100%;
    height: 100%;
    border: none;
    position: absolute;
}

.iframe-container iframe.hidden {
    display: none;
}

.iframe-container iframe.loading {
    filter: blur(15px);
    transition: filter 0.5s ease;
}

.iframe-loading {
    position: absolute;
    inset: 0;
    background: var(--bg);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 10;
}

.message-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;
    color: var(--text);
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(10, 10, 10, 0.4);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: 10;
}

.message-content {
    max-width: 400px;
    padding: 20px;
}

.message-content h1 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 8px;
}

.message-content p {
    color: var(--text-muted);
    font-size: 13px;
    word-break: break-all;
}

.spinner {
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 20px;
}

#skip-btn {
    margin-top: 20px;
    padding: 8px 16px;
    background: transparent;
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.15s;
    display: none;
}

#skip-btn:hover {
    border-color: var(--border-light);
    color: var(--text);
}



/* Spinner */
.tab-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

/* Settings Modal */
.wisp-settings-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.wisp-settings-modal.hidden {
    display: none;
}

.settings-card {
    background: var(--surface);
    width: 400px;
    max-width: 90vw;
    border-radius: 12px;
    border: 1px solid var(--border);
    overflow: hidden;
}

.settings-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
}

.settings-header h2 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 10px;
}

.close-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    font-size: 18px;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: all 0.15s;
    display: flex;
}

.close-btn:hover {
    color: var(--text);
    background: var(--surface-hover);
}

.settings-content {
    padding: 20px;
    max-height: 50vh;
    overflow-y: auto;
}

.section-title {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
    margin-bottom: 12px;
    font-weight: 600;
}

.server-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
}

.wisp-option {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.15s;
}

.wisp-option:hover {
    border-color: var(--border-light);
}

.wisp-option.active {
    border-color: var(--accent);
    background: rgba(59, 130, 246, 0.1);
}

.wisp-option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.wisp-option-name {
    font-size: 13px;
    font-weight: 500;
    color: var(--text);
    display: flex;
    align-items: center;
}

.wisp-option-url {
    font-family: 'Consolas', monospace;
    font-size: 11px;
    color: var(--text-muted);
}

.server-status {
    display: flex;
    align-items: center;
    gap: 6px;
}

.ping-text {
    font-family: 'Consolas', monospace;
    font-size: 11px;
    color: var(--text-muted);
}

.status-indicator {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--text-muted);
}

.status-indicator.status-success {
    background: #22c55e;
}

.status-indicator.status-error {
    background: #ef4444;
}

.custom-input-group {
    display: flex;
    gap: 8px;
}

.custom-input-group input {
    flex: 1;
    height: 36px;
    padding: 0 12px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: 'Consolas', monospace;
    font-size: 12px;
    outline: none;
    transition: all 0.15s;
}

.custom-input-group input:focus {
    border-color: var(--accent);
}

.custom-input-group button {
    height: 36px;
    padding: 0 14px;
    background: var(--accent);
    border: none;
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    transition: opacity 0.15s;
}

.custom-input-group button:hover {
    opacity: 0.9;
}

.settings-footer {
    padding: 12px 20px;
    border-top: 1px solid var(--border);
    color: var(--text-muted);
    font-size: 12px;
}

.delete-wisp-btn {
    background: transparent;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    margin-left: 6px;
    transition: color 0.15s;
}

.delete-wisp-btn:hover {
    color: #ef4444;
}

/* Toggle Switch */
.toggle-switch {
    width: 40px;
    height: 20px;
    background: var(--border);
    border-radius: 10px;
    position: relative;
    cursor: pointer;
    transition: background 0.2s;
}

.toggle-switch.active {
    background: var(--accent);
}

.toggle-knob {
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: transform 0.2s;
}

.toggle-switch.active .toggle-knob {
    transform: translateX(20px);
}

.flex {
    display: flex;
}
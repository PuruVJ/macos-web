import { mount } from 'svelte';
import './css/global.css';

const target = document.getElementById('root');

function showStartupError(error: unknown) {
	console.error('ChromeOS Web failed to start:', error);
	if (!target) return;
	target.innerHTML = `<div style="min-height:100vh;display:grid;place-items:center;background:#202124;color:#fff;font-family:Arial,sans-serif"><div style="padding:32px;border-radius:20px;background:#292a2d;max-width:680px"><h1>ChromeOS Web não conseguiu iniciar</h1><p>${String(error)}</p><button id="reset" style="padding:10px 16px;border:0;border-radius:12px;background:#1a73e8;color:#fff">Redefinir</button></div></div>`;
	document.getElementById('reset')?.addEventListener('click', () => { localStorage.clear(); sessionStorage.clear(); location.reload(); });
}

if (!target) throw new Error('ChromeOS Web: #root element was not found.');

try {
	const { default: ChromeOS } = await import('./components/ChromeOS/ChromeOS.svelte');
	mount(ChromeOS, { target });
} catch (error) {
	showStartupError(error);
}

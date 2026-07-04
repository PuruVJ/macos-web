/// <reference lib="webworker" />
import { Serwist, type PrecacheEntry } from 'serwist';

// vite-plugin-pwa (injectManifest strategy) replaces self.__WB_MANIFEST with the
// generated precache manifest at build time.
declare const self: ServiceWorkerGlobalScope & {
	__WB_MANIFEST: (PrecacheEntry | string)[];
};

const serwist = new Serwist({
	precacheEntries: self.__WB_MANIFEST,
	// Keep the "prompt to update" UX: the new worker waits until the user
	// confirms (handled by useRegisterSW in SystemUpdate.svelte).
	skipWaiting: false,
	clientsClaim: true,
	navigationPreload: true,
});

// virtual:pwa-register's updateServiceWorker() posts { type: 'SKIP_WAITING' } to
// the waiting worker — activate it so the page can reload onto the new version.
self.addEventListener('message', (event) => {
	if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

serwist.addEventListeners();

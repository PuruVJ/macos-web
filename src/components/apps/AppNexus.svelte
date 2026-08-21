<script lang="ts">
	import Safari from './Safari/Safari.svelte';
	import type { AppID } from '🍎/state/apps.svelte';

	const { app_id, is_being_dragged }: { app_id: AppID; is_being_dragged: boolean } = $props();
</script>

{#if app_id === 'finder'}
	{#await import('./Finder/Finder.svelte') then { default: Finder }}<Finder />{/await}
{:else if app_id === 'safari'}
	<Safari />
{:else if app_id === 'calendar'}
	{#await import('./Calendar/Calendar.svelte') then { default: Calendar }}<Calendar />{/await}
{:else if app_id === 'notes'}
	{#await import('./Notes/Notes.svelte') then { default: Notes }}<Notes />{/await}
{:else if app_id === 'terminal'}
	{#await import('./Terminal/Terminal.svelte') then { default: Terminal }}<Terminal />{/await}
{:else if app_id === 'system-preferences'}
	{#await import('./SystemPreferences/SystemPreferences.svelte') then { default: SystemPreferences }}<SystemPreferences />{/await}
{:else if app_id === 'vscode'}
	{#await import('./VSCode/VSCode.svelte') then { default: VSCode }}<VSCode {is_being_dragged} />{/await}
{:else if app_id === 'calculator'}
	{#await import('./Calculator/Calculator.svelte') then { default: Calculator }}<Calculator />{/await}
{:else if app_id === 'wallpapers'}
	{#await import('./WallpaperApp/WallpaperSelectorApp.svelte') then { default: WallpaperSelector }}<WallpaperSelector />{/await}
{:else if app_id === 'purus-twitter'}
	{#await import('./PurusProfile/PurusProfile.svelte') then { default: PurusProfile }}<PurusProfile />{/await}
{:else if app_id === 'appstore'}
	{#await import('./AppStore/AppStore.svelte') then { default: AppStore }}<AppStore {app_id} />{/await}
{:else}
	{#await import('./AppStore/AppStore.svelte') then { default: AppStore }}<AppStore {app_id} />{/await}
{/if}

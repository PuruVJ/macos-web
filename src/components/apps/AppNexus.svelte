<script lang="ts">
	import type { AppID } from '🍎/state/apps.svelte';
	import AppStore from './AppStore/AppStore.svelte';
	import Calculator from './Calculator/Calculator.svelte';
	import Calendar from './Calendar/Calendar.svelte';
	import PurusProfile from './PurusProfile/PurusProfile.svelte';
	import VSCode from './VSCode/VSCode.svelte';
	import WallpaperSelector from './WallpaperApp/WallpaperSelectorApp.svelte';

	const {
		app_id,
		is_being_dragged,
	}: {
		app_id: AppID;
		is_being_dragged: boolean;
	} = $props();
</script>

{#if app_id === 'calendar'}
	<Calendar />
{:else if app_id === 'vscode'}
	<VSCode {is_being_dragged} />
{:else if app_id === 'calculator'}
	<Calculator />
{:else if app_id === 'wallpapers'}
	<WallpaperSelector />
{:else if app_id === 'purus-twitter'}
	<PurusProfile />
{:else}
	<AppStore {app_id} />
{/if}

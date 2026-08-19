<svelte:options runes={true} />

<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { system_needs_update } from '🍎/state/system.svelte';
	import DockItem from './DockItem.svelte';

	let mouseX = $state<number | null>(null);
</script>

<svelte:head>
	<style>
		/* Use the repository's real app artwork instead of generic hand-drawn placeholders. */
		.dock-open-app-button .icon-shell {
			background-size: 100% 100%;
			background-position: center;
			background-repeat: no-repeat;
			box-shadow: none;
		}

		.dock-open-app-button .icon-shell > svg {
			opacity: 0;
			width: 100%;
			height: 100%;
		}

		.dock-open-app-button.finder .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/finder/256.png'); }
		.dock-open-app-button.safari .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/safari/256.png'); }
		.dock-open-app-button.calculator .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/calculator/256.png'); }
		.dock-open-app-button.calendar .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/calendar/256.png'); }
		.dock-open-app-button.notes .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/notes/256.png'); }
		.dock-open-app-button.terminal .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/terminal/256.png'); }
		.dock-open-app-button.vscode .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/vscode/256.png'); }
		.dock-open-app-button.system-preferences .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/system-preferences/256.png'); }
		.dock-open-app-button.appstore .icon-shell { background-image: url('${import.meta.env.BASE_URL}app-icons/appstore/256.png'); }
	</style>
</svelte:head>

<section class="dock-container" aria-label="Dock">
	<div
		class="dock-el"
		onmousemove={(event) => (mouseX = event.clientX)}
		onmouseleave={() => (mouseX = null)}
	>
		{#each Object.entries(apps_config).filter(([, config]) => config.showInDock && !config.disabled) as [appID]}
			<DockItem mouse_x={mouseX} app_id={appID} needs_update={system_needs_update.value} />
		{/each}
	</div>
</section>

<style>
	.dock-container {
		position: fixed;
		z-index: 10000;
		left: 0;
		bottom: .7rem;
		width: 100%;
		min-height: 5.25rem;
		display: flex;
		justify-content: center;
		pointer-events: none;
		padding: 0 .65rem;
	}

	.dock-el {
		min-height: 4.45rem;
		max-width: min(94vw, 860px);
		padding: .36rem .5rem .42rem;
		display: flex;
		align-items: flex-end;
		gap: .16rem;
		pointer-events: auto;
		border: 1px solid color-mix(in srgb, white 28%, transparent);
		border-radius: 1.45rem;
		background:
			linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,.07) 48%, rgba(255,255,255,.03)),
			color-mix(in srgb, var(--system-color-light) 18%, transparent);
		box-shadow:
			0 18px 42px rgba(0,0,0,.28),
			0 4px 12px rgba(0,0,0,.14),
			inset 0 1px 0 rgba(255,255,255,.35),
			inset 0 -1px 0 rgba(0,0,0,.12);
		backdrop-filter: blur(22px) saturate(145%);
		-webkit-backdrop-filter: blur(22px) saturate(145%);
		isolation: isolate;
	}

	@media (max-width: 640px) {
		.dock-container { bottom: .35rem; min-height: 4.6rem; }
		.dock-el { max-width: 99vw; overflow-x: auto; border-radius: 1.15rem; }
	}
</style>

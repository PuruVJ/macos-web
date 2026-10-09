<script lang="ts">
	import AppleIcon from '~icons/mdi/apple';
	import { click_outside, elevation, focus_outside } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps, type AppID } from '🍎/state/apps.svelte';
	import { menubar_state } from '🍎/state/menubar.svelte';
	import Menu from './Menu.svelte';

	const active_app = $derived(apps_config[apps.active as AppID]);
	const active_menus = $derived({
		...menubar_state.menus,
		default: {
			title: active_app.title,
			menu: {
				close_app: {
					title: `Close ${active_app.title}`,
					action: () => {
						apps.open[apps.active as AppID] = false;
						apps.minimized[apps.active as AppID] = false;
						apps.fullscreen[apps.active as AppID] = false;
						delete apps.minimized_previews[apps.active as AppID];
						delete apps.minimized_rects[apps.active as AppID];
						delete apps.window_rects[apps.active as AppID];
					},
				},
			},
		},
	});
</script>

<div
	class="container"
	use:click_outside={() => (menubar_state.active = '')}
	use:focus_outside={() => (menubar_state.active = '')}
>
	{#each Object.entries(active_menus) as [menuID, menuConfig]}
		<div>
			<div style:height="100%">
				<button
					class="menu-button"
					class:default-menu={menuID === 'default'}
					class:apple-icon-button={menuID === 'apple'}
					style:--scale={menubar_state.active === menuID ? 1 : 0}
					onclick={() => (menubar_state.active = menuID)}
					onmouseover={() => menubar_state.active && (menubar_state.active = menuID)}
					onfocus={() => (menubar_state.active = menuID)}
				>
					{#if menuID === 'apple'}
						<AppleIcon />
					{:else}
						{menuConfig.title}
					{/if}
				</button>
			</div>

			<div
				class="menu-parent"
				style:visibility={menubar_state.active === menuID ? 'visible' : 'hidden'}
				use:elevation={'menubar-menu-parent'}
			>
				<Menu menu={menuConfig.menu} />
			</div>
		</div>
	{/each}
</div>

<style>
	.container {
		height: 100%;

		display: flex;
		position: relative;
	}

	.menu-parent {
		position: absolute;
		margin-top: 1.5px;
	}

	.menu-button {
		font-weight: 500;

		border-radius: 0.25rem;

		position: relative;
		z-index: 1;

		padding: 0 0.5rem;

		height: 100%;

		&.default-menu {
			font-weight: 600 !important;
			margin: 0 6px;
		}

		&::after {
			content: '';

			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;

			height: 100%;
			width: 100%;

			border-radius: inherit;

			transform: scale(var(--scale), var(--scale));
			transform-origin: center center;

			transition: transform 100ms ease;

			background-color: hsla(var(--system-color-dark-hsl), 0.2);
		}
	}

	.apple-icon-button {
		margin: 0 0rem 0 0.5rem;
		padding: 0 0.7rem;

		display: block;

		:global(svg) {
			font-size: 1rem;
		}
	}
</style>

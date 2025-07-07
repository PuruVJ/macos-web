<script lang="ts">
	import DarkMode from '~icons/gg/dark-mode';
	import CheckedIcon from '~icons/ic/outline-check';
	import TransitionMaskedIcon from '~icons/mdi/transition-masked';
	import NotchIcon from '~icons/pepicons/smartphone-notch';

	import { autofocus } from '🍎/attachments';
	import { COLORS } from '🍎/configs/colors';
	import { apps } from '🍎/state/apps.svelte.ts';
	import { should_show_notch } from '🍎/state/menubar.svelte';
	import { reduced_motion, theme, wallpaper } from '🍎/state/preferences.svelte.ts';
	import ActionCenterSurface from './ActionCenterSurface.svelte';
	import ActionCenterTile from './ActionCenterTile.svelte';

	function toggle_theme() {
		theme.preference = theme.preference === 'light' ? 'dark' : 'light';
	}

	function toggle_notch() {
		should_show_notch.current = !should_show_notch.current;
	}

	function toggle_motion_preference() {
		reduced_motion.preference = reduced_motion.current ? 'false' : 'true';
	}

	function open_wallpapers_app() {
		apps.open.wallpapers = true;
		apps.active = 'wallpapers';
	}
</script>

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<section class="container" class:dark={theme.scheme === 'dark'} tabindex={-1} {@attach autofocus}>
	<!-- Main controls: Wifi, Bluetooth, Airdrop -->
	<ActionCenterSurface
		grid={[
			[1, 6],
			[1, 2],
		]}
	>
		<ActionCenterTile grid={[1, 1]} onclick={toggle_theme}>
			<span class="toggle-icon" class:filled={theme.scheme === 'dark'}>
				<DarkMode />
			</span>
			Dark mode
		</ActionCenterTile>
	</ActionCenterSurface>

	<ActionCenterSurface
		grid={[
			[7, 6],
			[1, 2],
		]}
	>
		<ActionCenterTile grid={[1, 1]} onclick={toggle_motion_preference}>
			<span class="toggle-icon" class:filled={!reduced_motion.current}>
				<TransitionMaskedIcon />
			</span>
			Animations
		</ActionCenterTile>
	</ActionCenterSurface>

	<ActionCenterSurface
		grid={[
			[1, 12],
			[3, 2],
		]}
	>
		<ActionCenterTile grid={[1, 1]} role="region">
			<div class="color-picker">
				<p>System Color</p>
				<div class="color-palette">
					{#each COLORS as color}
						<button data-accent={color} onclick={() => (theme.accent = color)}>
							{#if theme.accent === color}
								<CheckedIcon />
							{/if}
						</button>
					{/each}
				</div>
			</div>
		</ActionCenterTile>
	</ActionCenterSurface>

	<ActionCenterSurface
		grid={[
			[1, 12],
			[5, 3],
		]}
	>
		<ActionCenterTile grid={[1, 1]} onclick={open_wallpapers_app}>
			<div class="wallpaper-tile">
				<img class="wallpaper-thumbnail" src={wallpaper.config.thumbnail} alt="Current wallpaper" />

				<div class="wallpaper-info">
					<h3>{wallpaper.config.name}</h3>
					<p>{wallpaper.config.type} wallpaper</p>
				</div>
			</div>
		</ActionCenterTile>
	</ActionCenterSurface>

	<ActionCenterSurface
		grid={[
			[1, 12],
			[8, 2],
		]}
	>
		<ActionCenterTile grid={[1, 1]} onclick={toggle_notch}>
			<div class="notch-tile">
				<span class="toggle-icon" class:filled={should_show_notch.current}>
					<NotchIcon />
				</span>
				Notch
			</div>
		</ActionCenterTile>
	</ActionCenterSurface>
</section>

<style>
	.container {
		--border-size: 0;

		display: grid;
		grid-template-columns: repeat(12, 1fr);
		grid-auto-rows: minmax(1.55rem, auto);
		gap: 0.75rem;

		width: 19.5rem;

		padding: 0.75rem;

		position: relative;

		user-select: none;

		background-color: color-mix(in lch, var(--system-color-light), transparent 70%);

		border-radius: 1rem;

		box-shadow:
			lch(0% 0 0 / 0.3) 0px 0px 11px 0px,
			inset 0 0 0 var(--border-size) color-mix(in lch, var(--system-color-dark), transparent 70%),
			0 0 0 var(--border-size) color-mix(in lch, var(--system-color-light), transparent 70%);

		&.dark {
			--border-size: 0.5px;
		}

		&::before {
			content: '';

			width: 100%;
			height: 100%;

			border-radius: inherit;

			position: absolute;
			left: 0;
			top: 0;

			z-index: -1;
			backdrop-filter: blur(12px);
		}
	}

	.toggle-icon {
		--size: 1.7rem;

		--bgcolor: var(--system-color-dark);
		--bgalpha: 90%;

		--svgcolor: var(--system-color-light-contrast);
		--svgalpha: 10%;

		height: var(--size) !important;
		width: var(--size);

		padding: 0;

		display: flex;
		justify-content: center;
		place-items: center;

		border-radius: 50%;

		background-color: color-mix(in lch, var(--bgcolor), transparent var(--bgalpha));

		transition:
			box-shadow 100ms ease,
			background-color 150ms ease;

		:global(svg) {
			color: color-mix(in lch, var(--svgcolor), transparent var(--svgalpha));
		}

		&:focus-visible {
			box-shadow: 0 0 0 0.25rem color-mix(in lch, var(--bgcolor), transparent 60%);
		}

		&.filled {
			--bgcolor: var(--system-accent);
			--bgalpha: 0%;

			--svgcolor: var(--system-accent-contrast);
			--svgalpha: 0%;
		}
	}

	.wallpaper-tile {
		height: 100%;
		width: 100%;

		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1rem;
		align-items: center;

		padding: 0.25rem 0 0.25rem 0.25rem;

		img {
			aspect-ratio: 1 / 1;
			height: 4.5rem;

			object-fit: cover;

			border-radius: 0.5rem;
		}

		h3 {
			width: 100%;

			font-size: 1rem;
			line-height: 1.618;
		}

		p {
			text-transform: capitalize;
			font-size: 0.8rem;
			font-weight: 400;
		}
	}

	.color-picker {
		height: max-content;
		width: 100%;

		display: grid;
		gap: 0.5rem;

		padding: 0.25rem;

		.color-palette {
			margin-top: 0.5rem;

			display: flex;
			justify-content: space-between;

			width: 100%;

			button {
				height: 1.4rem;
				width: 1.4rem;

				color: var(--system-color-grey-100);

				border-radius: 50%;

				background-color: var(--system-accent);

				transition: box-shadow 200ms ease-in;

				&:hover,
				&:focus-visible {
					box-shadow: 0 0 0 0.2rem color-mix(in lch, var(--color), transparent 75%);
				}
			}
		}
	}

	.notch-tile {
		display: flex;
		gap: 0.5rem;
		align-items: center;

		padding: 0 0.6rem;

		width: 100%;
		height: 100%;
	}
</style>

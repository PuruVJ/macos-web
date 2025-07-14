<script lang="ts">
	import DarkMode from '~icons/gg/dark-mode';
	import CheckedIcon from '~icons/ic/outline-check';
	import TransitionMaskedIcon from '~icons/mdi/transition-masked';
	import NotchIcon from '~icons/pepicons/smartphone-notch';

	import { autofocus } from '🍎/attachments';
	import { COLORS } from '🍎/configs/colors';
	import { apps } from '🍎/state/apps.svelte.ts';
	import { should_show_notch } from '🍎/state/menubar.svelte';
	import { brightness, reduced_motion, theme, wallpaper } from '🍎/state/preferences.svelte.ts';
	import Slider from '../SystemUI/Slider.svelte';
	import ActionCenterSurface from './ActionCenterSurface.svelte';
	import ActionCenterTile from './ActionCenterTile.svelte';
	import { Toggleable } from '🍎/state/toggleable.svelte';

	const notch = Toggleable.of(should_show_notch);

	function toggle_theme() {
		theme.preference = theme.preference === 'light' ? 'dark' : 'light';
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
<section class={['container', theme.scheme === 'dark' && 'dark']} tabindex={-1} {@attach autofocus}>
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
			[3, 1],
		]}
	>
		<ActionCenterTile grid={[1, 1]}>
			<Slider
				value={brightness.current}
				onValueChange={(val) => {
					brightness.current = val;
				}}
				min={10}
				max={100}
			/>
		</ActionCenterTile>
	</ActionCenterSurface>

	<ActionCenterSurface
		grid={[
			[1, 12],
			[4, 2],
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
			[6, 3],
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
			[9, 2],
		]}
	>
		<ActionCenterTile grid={[1, 1]} onclick={notch.toggle}>
			<div class="notch-tile">
				<span class="toggle-icon" class:filled={notch.current}>
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

		padding: 0.25rem;

		position: relative;

		user-select: none;
		/* opacity: 0; */

		transition: all 200ms var(--sine-in);

		/* background-color: lch(from var(--system-color-light) l c h / 30%); */

		border-radius: 1rem;

		&.dark {
			--border-size: 0.5px;
		}

		/* &.visible {
			opacity: 1;
		} */

		&::before {
			content: '';

			width: 100%;
			height: 100%;

			border-radius: inherit;

			position: absolute;
			left: 0;
			top: 0;

			transition: all 300ms var(--sine-in);

			z-index: -1;
			backdrop-filter: blur(5px);
			mask: linear-gradient(to right, transparent, black 10%, black 90%, transparent),
				linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
			mask-composite: intersect;
		}
	}

	.toggle-icon {
		--size: 2.5rem;

		--bgcolor: var(--system-color-dark);
		--bgalpha: 10%;

		--svgcolor: var(--system-color-light-contrast);
		--svgalpha: 90%;

		height: var(--size) !important;
		width: var(--size);

		padding: 0;

		display: flex;
		justify-content: center;
		place-items: center;

		border-radius: 50%;

		background-color: lch(100% 0 0 / 80%);

		transition:
			box-shadow 100ms ease,
			background-color 150ms ease;

		:global {
			svg {
				color: lch(0% 0 0 / 50%);
				height: calc(var(--size) * 0.55);
				width: calc(var(--size) * 0.55);
			}
		}

		&:focus-visible {
			box-shadow: 0 0 0 0.25rem lch(from var(--bgcolor) l c h / 40%);
		}

		&.filled :global {
			svg {
				color: var(--system-accent);
			}
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

			border-radius: 0.875rem;
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
					box-shadow: 0 0 0 0.2rem lch(from var(--color) l c h / 25%);
				}
			}
		}
	}

	.notch-tile {
		display: flex;
		gap: 0.5rem;
		align-items: center;

		padding: 0 0.09rem;

		width: 100%;
		height: 100%;
	}
</style>

<script lang="ts">
	import { onMount } from 'svelte';
	import { quintInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';
	import AppleIcon from '~icons/mdi/apple';
	import { elevation } from '🍎/actions';
	import { fade_out } from '🍎/helpers/fade.ts';
	import { sleep } from '🍎/helpers/sleep';

	let hidden_splash_screen = $state(false);
	let progress_val = tweened(100, { duration: 1200, easing: quintInOut });

	onMount(async () => {
		$progress_val = 0;
		await sleep(1500);
		hidden_splash_screen = true;
	});
</script>

{#if !(hidden_splash_screen || import.meta.env.DEV)}
	<div out:fade_out={{ duration: 400 }} class="splash-screen" use:elevation={'bootup-screen'}>
		<AppleIcon />
		<div
			class="progress"
			role="progressbar"
			aria-valuenow={100 - $progress_val}
			aria-valuemin={0}
			aria-valuemax={100}
			aria-valuetext="Loading up macOS Web"
		>
			<div class="indicator" style:translate="-{$progress_val}% 0"></div>
		</div>
	</div>
{/if}

{#if import.meta.env.PROD}
	<iframe id="audio" src={`${import.meta.env.BASE_URL}sounds/mac-startup-sound.mp3`} allow="autoplay" title="macOS startup sound"></iframe>
{/if}

<style>
	.splash-screen {
		position: fixed;
		inset: 0;
		height: 100vh;
		width: 100vw;
		cursor: none;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 2rem;
		background-color: #000;
	}

	.progress {
		border-radius: 50px;
		height: 4px;
		width: 150px;
		overflow: hidden;
		background-color: var(--system-color-grey-800);
	}

	.indicator {
		background-color: var(--system-color-grey-100);
		border-radius: inherit;
		width: 100%;
		height: 100%;
	}

	#audio {
		position: absolute;
		width: 0;
		height: 0;
		border: 0;
		opacity: 0;
		pointer-events: none;
	}
</style>

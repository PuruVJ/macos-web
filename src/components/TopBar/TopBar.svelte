<script lang="ts">
	import { fade_out } from '🍎/helpers/fade';
	import { should_show_notch } from '🍎/state/menubar.svelte.ts';
	import { sineIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import ActionCenterToggle from './ActionCenterToggle.svelte';
	import MenuBar from './MenuBar.svelte';
	import TopBarTime from './TopBarTime.svelte';
</script>

<header>
	<div class="bar-content">
		<MenuBar />
		<span class="spacer"></span>
		{#if should_show_notch.value}
			<div class="notch" in:fade={{ duration: 150, easing: sineIn }} out:fade_out>
				<span><img src={`${import.meta.env.BASE_URL}emojis/wink.png`} alt="Wink" class="emoji" /></span>
			</div>
		{/if}
		<div class="right-group">
			<ActionCenterToggle />
			<button class="clock" aria-label="Current time"><TopBarTime /></button>
		</div>
	</div>
</header>

<style>
	header {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 10001;
		width: 100%;
		height: 1.9rem;
		padding: .14rem .35rem;
		pointer-events: none;
	}
	.bar-content {
		position: relative;
		height: 100%;
		display: flex;
		align-items: center;
		padding: 0 .18rem;
		border: 1px solid rgba(255,255,255,.16);
		border-radius: .72rem;
		background: linear-gradient(180deg, rgba(255,255,255,.16), rgba(255,255,255,.065));
		box-shadow: inset 0 1px 0 rgba(255,255,255,.2), 0 3px 12px rgba(0,0,0,.08);
		backdrop-filter: blur(18px) saturate(145%);
		-webkit-backdrop-filter: blur(18px) saturate(145%);
		color: var(--system-color-light-contrast);
		fill: var(--system-color-light-contrast);
		pointer-events: auto;
	}
	.spacer { flex: 1 1 auto; }
	.right-group { height: 100%; display:flex; align-items:center; gap:.05rem; }
	.clock { height:100%; padding:0 .55rem; border:0; border-radius:.55rem; background:transparent; font-weight:600; font-size:.76rem; letter-spacing:.15px; color:inherit; }
	.clock:hover, .clock:focus-visible { background:rgba(255,255,255,.1); outline:none; }
	.emoji { height:1.25em; width:1.25em; }
	.notch { --width:138px; position:absolute; top:-1px; left:50%; width:var(--width); height:1.9rem; display:grid; place-items:center; background:linear-gradient(180deg,#1b1b1d,#0d0d0f); border-radius:0 0 .65rem .65rem; transform:translateX(-50%); box-shadow:0 2px 8px rgba(0,0,0,.18); }
	.notch > span { opacity:0; transition:opacity .2s ease; }
	.notch:hover > span { opacity:1; }
	@media (max-width:640px){ header{padding:.08rem .2rem}.bar-content{border-radius:.58rem}.notch{--width:110px} }
</style>

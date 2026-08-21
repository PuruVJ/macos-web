<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const schemes = ['light', 'dark'] as const;
	const colors = ['blue', 'purple', 'pink', 'red', 'orange', 'yellow', 'green'] as const;

	function setScheme(scheme: (typeof schemes)[number]) {
		preferences.theme.scheme = scheme;
	}

	function setColor(color: (typeof colors)[number]) {
		preferences.theme.primaryColor = color;
	}
</script>

<section class="settings-shell">
	<header class="toolbar app-window-drag-handle">
		<div class="traffic-space" aria-hidden="true"></div>
		<strong>System Settings</strong>
	</header>

	<div class="content">
		<div class="hero">
			<img src={`${import.meta.env.BASE_URL}app-icons/system-preferences/256.png`} alt="System Settings" />
			<div>
				<h1>System Settings</h1>
				<p>Customize your macOS Web experience.</p>
			</div>
		</div>

		<section class="panel">
			<h2>Appearance</h2>
			<div class="row">
				<span>Theme</span>
				<div class="segmented">
					{#each schemes as scheme}
						<button class:active={preferences.theme.scheme === scheme} onclick={() => setScheme(scheme)}>
							{scheme === 'light' ? 'Light' : 'Dark'}
						</button>
					{/each}
				</div>
			</div>
			<div class="row">
				<span>Accent</span>
				<div class="colors">
					{#each colors as color}
						<button class:active={preferences.theme.primaryColor === color} class={`swatch ${color}`} onclick={() => setColor(color)} aria-label={color}></button>
					{/each}
				</div>
			</div>
		</section>

		<section class="panel">
			<h2>Accessibility</h2>
			<label class="toggle-row">
				<span>Reduce motion</span>
				<input type="checkbox" bind:checked={preferences.reduced_motion} />
			</label>
		</section>
	</div>
</section>

<style>
	.settings-shell { height:100%; width:100%; display:grid; grid-template-rows:3rem 1fr; overflow:hidden; color:var(--system-color-dark); background:color-mix(in srgb,var(--system-color-light) 90%,transparent); }
	.toolbar { position:relative; display:flex; align-items:center; justify-content:center; background:color-mix(in srgb,var(--system-surface-background) 92%,transparent); border-bottom:1px solid var(--system-divider); backdrop-filter:blur(20px) saturate(125%); }
	.toolbar strong { font-size:.8rem; }
	.traffic-space { position:absolute; inset:0; }
	.content { overflow:auto; padding:2rem clamp(1rem,5vw,4rem); max-width:50rem; width:100%; margin:auto; }
	.hero { display:flex; align-items:center; gap:1rem; padding:1rem; margin-bottom:1rem; border:1px solid var(--system-surface-border); border-radius:1rem; background:color-mix(in srgb,var(--system-surface-background) 84%,transparent); backdrop-filter:blur(14px); }
	.hero img { width:4rem; height:4rem; object-fit:contain; }
	h1 { margin:0; font-size:1.45rem; }
	.hero p { margin:.25rem 0 0; opacity:.58; font-size:.8rem; }
	.panel { padding:1rem; margin-top:1rem; border:1px solid var(--system-surface-border); border-radius:1rem; background:color-mix(in srgb,var(--system-surface-background) 78%,transparent); backdrop-filter:blur(14px); }
	h2 { margin:0 0 1rem; font-size:.85rem; }
	.row,.toggle-row { display:flex; align-items:center; justify-content:space-between; padding:.8rem 0; border-top:1px solid var(--system-divider); font-size:.82rem; }
	.row:first-of-type { border-top:0; }
	.segmented { display:flex; padding:.18rem; border-radius:.55rem; background:color-mix(in srgb,var(--system-color-dark) 8%,transparent); }
	.segmented button { padding:.35rem .75rem; border-radius:.4rem; color:inherit; font-size:.75rem; }
	.segmented button.active { background:color-mix(in srgb,var(--system-color-light) 85%,transparent); box-shadow:0 1px 4px rgba(0,0,0,.15); }
	.colors { display:flex; gap:.45rem; }
	.swatch { width:1.35rem; height:1.35rem; border-radius:50%; border:2px solid transparent; box-shadow:0 1px 4px rgba(0,0,0,.18); }
	.swatch.active { outline:2px solid var(--system-color-dark); outline-offset:2px; }
	.swatch.blue { background:#0a84ff; } .swatch.purple { background:#af52de; } .swatch.pink { background:#ff2d55; } .swatch.red { background:#ff3b30; } .swatch.orange { background:#ff9500; } .swatch.yellow { background:#ffcc00; } .swatch.green { background:#34c759; }
	input[type='checkbox'] { width:2.2rem; height:1.2rem; accent-color:var(--system-color-primary); }
</style>

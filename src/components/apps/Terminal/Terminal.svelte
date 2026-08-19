<script lang="ts">
	let history = $state<string[]>(['Last login: macOS Web']);
	let input = $state('');
	let cwd = $state('~');
	function run() {
		const command = input.trim();
		if (!command) return;
		const [name, ...args] = command.split(/\s+/);
		let output = '';
		switch (name.toLowerCase()) {
			case 'clear': history = []; input = ''; return;
			case 'help': output = 'Available: help, clear, pwd, ls, whoami, date, echo, cd'; break;
			case 'pwd': output = cwd === '~' ? '/Users/guest' : `/Users/guest/${cwd.replace(/^~\//, '')}`; break;
			case 'whoami': output = 'guest'; break;
			case 'date': output = new Date().toString(); break;
			case 'ls': output = 'Desktop  Documents  Downloads  Applications  Pictures'; break;
			case 'echo': output = args.join(' '); break;
			case 'cd': cwd = args[0] || '~'; break;
			default: output = `${name}: command not found`;
		}
		history = [...history, `${cwd} % ${command}`, ...(output ? [output] : [])];
		input = '';
	}
</script>
<section class="terminal app-window-drag-handle">
	<header><span class="traffic"></span><strong>Terminal</strong></header>
	<div class="screen" onclick={() => document.querySelector<HTMLInputElement>('#terminal-input')?.focus()}>
		{#each history as line}<div>{line}</div>{/each}
		<div class="prompt"><span>{cwd} %</span><input id="terminal-input" bind:value={input} onkeydown={(e) => e.key === 'Enter' && run()} autocomplete="off" spellcheck="false" aria-label="Terminal command" /></div>
	</div>
</section>
<style>
	.terminal { height:100%; width:100%; display:grid; grid-template-rows:2.7rem 1fr; background:#101112; color:#f5f5f5; font:13px/1.55 ui-monospace,SFMono-Regular,Menlo,monospace; border-radius:inherit; overflow:hidden; }
	header { display:flex; align-items:center; justify-content:center; position:relative; background:rgba(35,35,37,.88); border-bottom:1px solid #333; backdrop-filter:blur(16px); }
	strong { font:600 .75rem var(--system-font-family); color:#ddd; }
	.traffic { position:absolute; left:1rem; width:3.1rem; height:.75rem; border-radius:1rem; background:linear-gradient(90deg,#ff5f57 0 31%,transparent 31% 35%,#febc2e 35% 65%,transparent 65% 69%,#28c840 69%); }
	.screen { padding:1rem; overflow:auto; cursor:text; }
	.prompt { display:flex; gap:.55rem; }
	.prompt span { color:#62d66f; }
	input { flex:1; border:0; outline:0; background:transparent; color:#fff; font:inherit; }
</style>

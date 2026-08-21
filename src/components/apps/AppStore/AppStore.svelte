<script lang="ts">
	import { onMount } from 'svelte';
	import type { AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const { app_id }: { app_id: AppID } = $props();
	let selected = $state<string | null>(null);
	let score = $state(0);
	let best = $state(Number(localStorage.getItem('macos-web-best') || 0));
	let grid = $state<number[]>(Array(16).fill(0));
	let tic = $state<(string | null)[]>(Array(9).fill(null));
	let player = $state('X');
	let memory = $state<number[]>([]);
	let flipped = $state<number[]>([]);
	let matched = $state<number[]>([]);
	let memoryMoves = $state(0);

	onMount(() => {
		if (!grid.some(Boolean)) new2048();
		resetMemory();
	});

	function spawn(g: number[]) {
		const empty = g.map((v, i) => v === 0 ? i : -1).filter(i => i >= 0);
		if (!empty.length) return;
		g[empty[Math.floor(Math.random() * empty.length)]] = Math.random() < .9 ? 2 : 4;
	}
	function new2048() { grid = Array(16).fill(0); score = 0; spawn(grid); spawn(grid); }
	function move(dir: 'left'|'right'|'up'|'down') {
		const next = [...grid];
		const lines:number[][] = dir === 'left' || dir === 'right' ? [[0,1,2,3],[4,5,6,7],[8,9,10,11],[12,13,14,15]] : [[0,4,8,12],[1,5,9,13],[2,6,10,14],[3,7,11,15]];
		let changed=false;
		for (const line of lines) {
			let vals = line.map(i => next[i]).filter(Boolean);
			if (dir === 'right' || dir === 'down') vals.reverse();
			for (let i=0;i<vals.length-1;i++) if (vals[i]===vals[i+1]) { vals[i]*=2; score+=vals[i]; vals.splice(i+1,1); }
			while(vals.length<4) vals.push(0);
			if (dir === 'right' || dir === 'down') vals.reverse();
			line.forEach((idx,j)=>{ if(next[idx]!==vals[j]) changed=true; next[idx]=vals[j]; });
		}
		if(changed){ spawn(next); grid=next; if(score>best){best=score; localStorage.setItem('macos-web-best',String(best));} }
	}
	function resetTic(){ tic=Array(9).fill(null); player='X'; }
	function win(b:(string|null)[]){ return [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]].some(([a,b1,c])=>b[a]&&b[a]===b[b1]&&b[a]===b[c]); }
	function playTic(i:number){ if(tic[i]||win(tic)) return; const b=[...tic]; b[i]=player; tic=b; if(!win(b)) player=player==='X'?'O':'X'; }
	function resetMemory(){ memory=Array.from({length:8},(_,i)=>i/2|0); memory=[...memory,...memory].sort(()=>Math.random()-.5); flipped=[]; matched=[]; memoryMoves=0; }
	function flipCard(i:number){ if(flipped.includes(i)||matched.includes(i)||flipped.length>=2) return; flipped=[...flipped,i]; if(flipped.length===2){ memoryMoves+=1; const [a,b]=flipped; if(memory[a]===memory[b]) matched=[...matched,a,b]; else setTimeout(()=>flipped=[],650); } }
</script>

<section class="store">
	<header class="storebar app-window-drag-handle"><div><strong>App Store</strong><span>Jogos e Apps</span></div><div class="pill"></div></header>
	{#if selected}
		<div class="game-view">
			<button class="back" onclick={() => selected=null}>‹ Voltar</button>
			{#if selected==='2048'}
				<div class="game-card"><div class="game-title"><h1>2048</h1><p>Melhor: {best}</p></div><div class="board2048">{#each grid as cell}<div class="tile t{cell}">{cell||''}</div>{/each}</div><div class="hint">Use as setas do teclado</div><button class="primary" onclick={new2048}>Novo jogo</button></div>
			{:else if selected==='tictactoe'}
				<div class="game-card"><div class="game-title"><h1>Jogo da Velha</h1><p>Vez: {player}</p></div><div class="tic">{#each tic as cell,i}<button onclick={() => playTic(i)}>{cell||''}</button>{/each}</div><button class="primary" onclick={resetTic}>Reiniciar</button></div>
			{:else}
				<div class="game-card"><div class="game-title"><h1>Memória</h1><p>Jogadas: {memoryMoves}</p></div><div class="memory">{#each memory as card,i}<button class:open={flipped.includes(i)||matched.includes(i)} onclick={() => flipCard(i)}>{flipped.includes(i)||matched.includes(i)?card+1:'?'}</button>{/each}</div><button class="primary" onclick={resetMemory}>Novo jogo</button></div>
			{/if}
		</div>
	{:else}
		<div class="hero glass"><div><span class="eyebrow">macOS Tahoe</span><h1>Feito para jogar.</h1><p>Pequenos jogos, sem instalação, funcionando direto no seu Mac Web.</p></div><div class="hero-icon"></div></div>
		<div class="section-title"><h2>Jogos</h2><span>3 jogos incluídos</span></div>
		<div class="cards">
			<button class="app-card glass" onclick={() => selected='2048'}><div class="icon purple">2048</div><div><strong>2048</strong><p>Desafie seu melhor placar.</p></div><span class="get">Jogar</span></button>
			<button class="app-card glass" onclick={() => selected='tictactoe'}><div class="icon blue">×○</div><div><strong>Jogo da Velha</strong><p>Partida rápida para 2 símbolos.</p></div><span class="get">Jogar</span></button>
			<button class="app-card glass" onclick={() => selected='memory'}><div class="icon green">◎</div><div><strong>Memória</strong><p>Encontre os pares.</p></div><span class="get">Jogar</span></button>
		</div>
	{/if}
</section>

<svelte:window onkeydown={(e) => selected==='2048' && ({ArrowLeft:()=>move('left'),ArrowRight:()=>move('right'),ArrowUp:()=>move('up'),ArrowDown:()=>move('down')}[e.key as 'ArrowLeft']?.())} />

<style>
	.store{height:100%;overflow:auto;background:linear-gradient(180deg,color-mix(in srgb,var(--system-color-light) 88%,transparent),color-mix(in srgb,var(--system-color-light) 98%,transparent));color:var(--system-color-light-contrast)}
	.storebar{position:sticky;top:0;z-index:2;display:flex;align-items:center;justify-content:space-between;padding:1rem 1.25rem;background:rgba(255,255,255,.18);backdrop-filter:blur(22px) saturate(145%);border-bottom:1px solid rgba(255,255,255,.35)}
	.storebar strong{display:block;font-size:1.05rem}.storebar span{display:block;font-size:.72rem;opacity:.58}.pill{width:2rem;height:2rem;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.3);border:1px solid rgba(255,255,255,.45)}
	.hero{margin:1rem;border-radius:1.5rem;padding:1.7rem;display:flex;align-items:center;justify-content:space-between;min-height:10rem;background:linear-gradient(135deg,rgba(255,255,255,.48),rgba(255,255,255,.14));border:1px solid rgba(255,255,255,.45);box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 12px 34px rgba(0,0,0,.08);backdrop-filter:blur(22px)}
	.eyebrow{font-size:.75rem;font-weight:700;opacity:.55}.hero h1{margin:.2rem 0 .35rem;font-size:2rem;letter-spacing:-.04em}.hero p{margin:0;max-width:34rem;opacity:.7}.hero-icon{font-size:4rem;opacity:.9}
	.section-title{display:flex;justify-content:space-between;align-items:end;padding:0 1rem;margin:1.3rem 0 .7rem}.section-title h2{margin:0;font-size:1.25rem}.section-title span{font-size:.78rem;opacity:.55}
	.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.8rem;padding:0 1rem 1rem}.app-card{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:.75rem;text-align:left;padding:.9rem;border-radius:1.25rem;border:1px solid rgba(255,255,255,.42);background:rgba(255,255,255,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.42),0 8px 24px rgba(0,0,0,.06);backdrop-filter:blur(18px);color:inherit}.app-card:hover{background:rgba(255,255,255,.34);transform:translateY(-1px)}.app-card strong{font-size:.93rem}.app-card p{margin:.18rem 0 0;font-size:.74rem;opacity:.6}.get,.primary{border:0;border-radius:999px;background:#0a84ff;color:white;padding:.42rem .72rem;font-size:.72rem;font-weight:650}.icon{width:3rem;height:3rem;border-radius:.8rem;display:grid;place-items:center;color:white;font-weight:800;font-size:.9rem;box-shadow:inset 0 1px 0 rgba(255,255,255,.3),0 5px 10px rgba(0,0,0,.15)}.purple{background:linear-gradient(135deg,#8c5cff,#5c22d4)}.blue{background:linear-gradient(135deg,#3aa0ff,#1766d0)}.green{background:linear-gradient(135deg,#3ecf8e,#169e5d)}
	.game-view{padding:1rem}.back{border:0;background:transparent;color:inherit;opacity:.7;font-size:.85rem}.game-card{max-width:30rem;margin:1rem auto;padding:1rem;border-radius:1.4rem;background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.4);backdrop-filter:blur(20px);box-shadow:0 18px 50px rgba(0,0,0,.08)}.game-title{display:flex;justify-content:space-between;align-items:center}.game-title h1{margin:0;font-size:1.5rem}.game-title p{margin:0;opacity:.6;font-size:.8rem}
	.board2048{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin:1rem 0;padding:.5rem;border-radius:1rem;background:rgba(80,80,90,.12)}.tile{aspect-ratio:1;border-radius:.65rem;display:grid;place-items:center;background:rgba(255,255,255,.32);font-size:1.1rem;font-weight:750}.t2{background:#eee4da}.t4{background:#ede0c8}.t8{background:#f2b179;color:#fff}.t16{background:#f59563;color:#fff}.t32{background:#f67c5f;color:#fff}.t64{background:#f65e3b;color:#fff}.t128{background:#edcf72;color:#fff}.t256{background:#edcc61;color:#fff}.t512{background:#edc850;color:#fff}.t1024,.t2048{background:#edc53f;color:#fff}.hint{font-size:.72rem;opacity:.55;margin:.5rem 0 1rem;text-align:center}
	.tic{display:grid;grid-template-columns:repeat(3,1fr);gap:.45rem;margin:1rem 0}.tic button{aspect-ratio:1;border:1px solid rgba(255,255,255,.35);border-radius:1rem;background:rgba(255,255,255,.22);font-size:2rem;color:inherit}.memory{display:grid;grid-template-columns:repeat(4,1fr);gap:.45rem;margin:1rem 0}.memory button{aspect-ratio:1;border:1px solid rgba(255,255,255,.35);border-radius:.8rem;background:linear-gradient(135deg,rgba(10,132,255,.8),rgba(70,160,255,.6));color:#fff;font-size:1.4rem;font-weight:700}.memory button.open{background:rgba(255,255,255,.48);color:inherit}.primary{margin-top:.4rem}
	@media(max-width:800px){.cards{grid-template-columns:1fr}.hero{padding:1.2rem}.hero h1{font-size:1.5rem}}
</style>

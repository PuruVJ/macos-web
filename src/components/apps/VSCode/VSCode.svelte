<script lang="ts">
	const {
		is_being_dragged,
	}: {
		is_being_dragged: boolean;
	} = $props();

	$inspect(is_being_dragged);
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<div>
		<iframe
			src="https://stackblitz.com/github/puruvj/macos-web?embed=1&file=src/components/Desktop/Desktop.svelte&hideNavigation=1&theme=dark&view=editor"
			title="VS Code for macOS Web"
		></iframe>
	</div>
</section>

<style>
	.container {
		background-color: #202327;
		padding: 1px;

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto 1fr;
	}

	iframe {
		width: 100%;
		height: 100%;

		border-radius: 0 0 0.75rem 0.75rem;
	}

	header {
		padding: 0.9rem;
	}

	:global(.tl-container.vscode) {
		top: 0.6rem;
		left: 0.6rem;
	}
</style>

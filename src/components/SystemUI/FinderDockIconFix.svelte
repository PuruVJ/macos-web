<svelte:head>
	<style>
		.dock-open-app-button.finder .icon-shell {
			background-image: url('${import.meta.env.BASE_URL}app-icons/finder/256.png');
			background-size: 100% 100%;
			background-position: center;
			background-repeat: no-repeat;
			box-shadow: none;
		}

		.dock-open-app-button.finder .icon-shell > svg {
			opacity: 0;
			height: 100%;
			width: 100%;
		}
	</style>
</svelte:head>

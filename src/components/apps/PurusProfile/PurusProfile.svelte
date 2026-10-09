<script lang="ts">
	import { preferences } from '🍎/state/preferences.svelte.ts';
	import TwitterIcon from '~icons/mdi/twitter';
	import BlogIcon from '~icons/mdi/grease-pencil';
	import WorksIcon from '~icons/ic/round-workspaces';
	import GithubIcon from '~icons/mdi/github';
	import DevToIcon from '~icons/mdi/dev-to';

	function external(node: HTMLAnchorElement) {
		node.rel = 'noopener noreferrer';
		node.target = '_blank';
	}
</script>

<section class="container">
	<header class="titlebar app-window-drag-handle">
		<span>About the Developer</span>
	</header>

	<aside class:light={preferences.theme.scheme === 'light'}>
		<nav>
			<a href="https://www.puruvj.dev/blog" use:external> <BlogIcon /> Blog </a>
			<a href="https://www.puruvj.dev/works" use:external> <WorksIcon /> Works </a>

			<hr />

			<a href="https://www.puruvj.dev/twitter" use:external>
				<TwitterIcon />
				Twitter
			</a>
			<a href="https://www.puruvj.dev/github" use:external> <GithubIcon /> Github </a>
			<a href="https://www.puruvj.dev/devto" use:external> <DevToIcon /> Dev.to </a>
		</nav>
	</aside>

	<section class="content">
		<img height="200" width="200" src="/purus-profile/puru.webp" alt="Puru Vijay Profile pic" />

		<h1>Hi, I'm Puru</h1>

		<h2>
			I'm the creator of macOS Web, which you're on right now
			<img src="/emojis/wink.png" alt="Wink emoji" class="emoji" />
		</h2>

		<p>
			I am a fullstack web developer, with an infinite amount of love for frontend web development,
			esp JavaScript, TypeScript, and for frontend frameworks like Svelte, Vue and React
			<img src="/emojis/star-struck.png" alt="Star Struck face emoji" class="emoji" />
		</p>

		<p>
			However, my love for tech doesn't end there. I enjoy writing backend APIs, scripts, working
			with databases, and my fav platforms are NodeJS, Deno and Go
		</p>
	</section>
</section>

<style>
	.container {
		--color: var(--system-color-light-hsl);
		--sidebar-width: clamp(8rem, 25%, 12rem);

		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		display: grid;
		grid-template-columns: var(--sidebar-width) minmax(0, 1fr);
		grid-template-rows: 3rem minmax(0, 1fr);
		overflow: hidden;

		border-radius: inherit;

		background-image: linear-gradient(
			to right,
			hsla(var(--color), 0.7) var(--sidebar-width),
			hsla(var(--color), 1) var(--sidebar-width) 100%
		);

		transition: --color 200ms ease-in;

		color: var(--system-color-dark);
	}

	.titlebar {
		grid-area: 1 / 1 / span 1 / span 2;

		display: flex;
		justify-content: center;

		z-index: 1;

		padding: 0.9rem 1rem;

		width: 100%;

		border-top-left-radius: inherit;
		border-top-right-radius: inherit;

		user-select: none;

		span {
			color: hsla(var(--system-color-dark-hsl), 0.8);
			font-weight: 500;
			font-size: 0.9rem;
			letter-spacing: 0.5px;
		}
	}

	aside {
		grid-area: 1 / 1 / span 2 / span 1;

		transform: translateZ(0);

		height: calc(100% - 3px);
		width: calc(var(--sidebar-width) - 3px);

		margin: 1.5px 0 0 1.5px;

		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: inherit;
		overflow: hidden;

		&::before {
			content: '';

			width: inherit;
			height: inherit;

			border-radius: inherit;

			position: fixed;
			left: 0;
			top: 0;

			z-index: -1;
			backdrop-filter: blur(12px);
		}

		&.light {
			border-bottom-left-radius: inherit;
		}

		nav {
			display: flex;
			flex-direction: column;
			gap: 0.2rem;

			margin: 4rem 0.6rem;

			hr {
				display: block;

				width: 100%;
				height: 1px;

				background-color: hsla(var(--system-color-dark-hsl), 0.2);

				border: none;
			}

			a {
				display: flex;
				gap: 0.4rem;
				align-items: center;

				color: hsla(var(--system-color-dark-hsl), 0.9);
				text-decoration: none;
				font-weight: 400;

				padding: 0.5rem 0.5rem;

				border-radius: 0.4rem;

				transition: background-color 100ms ease;

				&:hover {
					background-color: hsla(var(--system-color-dark-hsl), 0.2);
				}
			}
		}
	}

	.content {
		grid-area: 2 / 2 / span 1 / span 1;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		gap: 0.8rem;

		min-width: 0;
		min-height: 0;
		overflow: auto;
		padding: clamp(1rem, 4vw, 2rem);
		text-align: center;

		img {
			width: min(10rem, 35%);
			height: auto;
			aspect-ratio: 1;
			border-radius: 50%;
			object-fit: cover;
		}
	}

	.emoji {
		height: 1em;
		width: 1em;
		vertical-align: middle;
	}

	.content img.emoji {
		width: 1em;
		height: 1em;
		aspect-ratio: auto;
		border-radius: 0;
	}

	h1,
	h2,
	p {
		max-width: 42rem;
	}

	h1 {
		font-size: clamp(1.6rem, 4vw, 2.4rem);
		line-height: 1.15;
	}

	h2 {
		font-size: clamp(1rem, 2.5vw, 1.4rem);
		line-height: 1.35;
	}

	p {
		font-size: 0.95rem;
		line-height: 1.5;
	}

	@media (max-width: 520px) {
		.container {
			--sidebar-width: 7.5rem;
		}

		aside nav {
			margin: 3.5rem 0.35rem;
		}

		aside nav a {
			padding: 0.45rem 0.35rem;
			font-size: 0.85rem;
		}

		.content {
			gap: 0.55rem;
			padding: 0.75rem;
		}
	}
</style>

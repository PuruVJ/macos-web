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

		<br />

		<h1>Hi, I'm Puru</h1>

		<h2>
			I'm the creator of macOS Web, which you're on right now
			<img src="/emojis/wink.png" alt="Wink emoji" class="emoji" />
		</h2>

		<br /><br />

		<p>
			I am a fullstack web developer, with an infinite amount of love for frontend web development,
			esp JavaScript, TypeScript, and for frontend frameworks like Svelte, Vue and React
			<img src="/emojis/star-struck.png" alt="Star Struck face emoji" class="emoji" />
		</p>

		<br /><br />

		<p>
			However, my love for tech doesn't end there. I enjoy writing backend APIs, scripts, working
			with databases, and my fav platforms are NodeJS, Deno and Go
		</p>
	</section>
</section>

<style>
	.container {
		--color: var(--system-color-light-hsl);

		display: grid;
		grid-template-columns: 12rem 1fr;
		grid-template-rows: 3rem 1fr;

		border-radius: inherit;

		background-image: linear-gradient(
			to right,
			hsla(var(--color), 0.7) 12rem,
			hsla(var(--color), 1) 12rem 100%
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

		height: calc(100% - 2.7px);
		width: calc(12rem - 2.27px);

		margin: 1.8px 0 0px 1.8px;

		border-top-left-radius: 0.5rem;
		border-bottom-left-radius: inherit;

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
			height: calc(100% - 3px);
			width: calc(12rem - 2.5px);

			margin: 1.7px 0 0px 1.7px;

			border-top-left-radius: 0.5rem;
			border-bottom-left-radius: 0.5rem;
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
		align-items: center;

		padding: 1rem;

		img {
			border-radius: 50%;
		}
	}

	.emoji {
		height: 1em;
		width: 1em;

		vertical-align: middle;
	}

	h1 {
		font-size: 2.618rem;
		line-height: 1.618;
	}

	h2 {
		font-size: 1.618rem;
		line-height: 1.2;
	}

	p {
		line-height: 1.618rem;
	}
</style>

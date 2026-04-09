<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';

	let menuOpen = $state(false);

	function toggleMenu() {
		menuOpen = !menuOpen;
	}

	function isActive(path: string): boolean {
		return $page.url.pathname === base + path;
	}
</script>

<nav class="fixed top-8 z-50 w-full border-b border-gray-200 bg-white">
	<div class="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between px-4 py-2.5">
		<a href="{base}/" class="flex items-center">
			<span class="self-center whitespace-nowrap text-xl font-semibold">Tap-Recap</span>
		</a>

		<button
			type="button"
			class="inline-flex h-10 w-10 items-center justify-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 md:hidden"
			onclick={toggleMenu}
		>
			<span class="sr-only">Open main menu</span>
			<svg class="h-5 w-5" fill="none" viewBox="0 0 17 14">
				<path
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M1 1h15M1 7h15M1 13h15"
				/>
			</svg>
		</button>

		<div class="w-full md:block md:w-auto {menuOpen ? '' : 'hidden'}">
			<ul
				class="mt-4 flex flex-col rounded-lg border border-gray-100 bg-gray-50 p-4 font-medium md:mt-0 md:flex-row md:space-x-8 md:border-0 md:bg-white md:p-0"
			>
				<li>
					<a
						href="{base}/"
						class="block rounded px-3 py-2 {isActive('/')
							? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700'
							: 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}"
					>
						Tap
					</a>
				</li>
				<li>
					<a
						href="{base}/recap"
						class="block rounded px-3 py-2 {isActive('/recap')
							? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700'
							: 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}"
					>
						Recap
					</a>
				</li>
				<li>
					<a
						href="{base}/calendar"
						class="block rounded px-3 py-2 {isActive('/calendar')
							? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700'
							: 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}"
					>
						Calendar
					</a>
				</li>
				<li>
					<a
						href="{base}/chart"
						class="block rounded px-3 py-2 {isActive('/chart')
							? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700'
							: 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}"
					>
						Chart
					</a>
				</li>
				<li>
					<a
						href="{base}/settings"
						class="block rounded px-3 py-2 {isActive('/settings')
							? 'bg-blue-700 text-white md:bg-transparent md:text-blue-700'
							: 'text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700'}"
					>
						Settings
					</a>
				</li>
			</ul>
		</div>
	</div>
</nav>

<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Navigation from '$lib/components/Navigation.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Tap-Recap</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<div class="bg-amber-500 px-4 py-2 text-center text-sm font-medium text-white">
		Early development version — things may break or change
	</div>
	<Navigation />
	<main class="pb-16">
		{@render children()}
	</main>
</div>

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
	<Navigation />
	<main class="pb-16">
		{@render children()}
	</main>
</div>

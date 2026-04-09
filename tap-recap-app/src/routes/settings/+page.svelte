<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Settings</h1>

	<div class="grid gap-4 md:grid-cols-2">
		<a
			href="{base}/settings/moods"
			class="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
		>
			<h3 class="mb-2 text-xl font-semibold">Moods</h3>
			<p class="text-gray-600">Manage mood options and tags</p>
		</a>

		<a
			href="{base}/settings/actors"
			class="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
		>
			<h3 class="mb-2 text-xl font-semibold">Actors</h3>
			<p class="text-gray-600">Manage actor options and tags</p>
		</a>

		<a
			href="{base}/settings/actions"
			class="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
		>
			<h3 class="mb-2 text-xl font-semibold">Actions</h3>
			<p class="text-gray-600">Manage action options and tags</p>
		</a>

		<a
			href="{base}/settings/preferences"
			class="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
		>
			<h3 class="mb-2 text-xl font-semibold">Preferences</h3>
			<p class="text-gray-600">Customize app behavior and defaults</p>
		</a>

		<a
			href="{base}/settings/export"
			class="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
		>
			<h3 class="mb-2 text-xl font-semibold">Export Data</h3>
			<p class="text-gray-600">Export your emotes and configuration</p>
		</a>

		<a
			href="{base}/settings/import"
			class="block cursor-pointer rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-lg"
		>
			<h3 class="mb-2 text-xl font-semibold">Import Data</h3>
			<p class="text-gray-600">Import emotes and configuration</p>
		</a>
	</div>

	<div class="mt-6 rounded-lg bg-white p-6 shadow">
		<h3 class="mb-2 text-lg font-semibold">About</h3>
		<p class="mb-2 text-gray-600">
			Tap-Recap is an open-source emotion tracking app for rapid journaling.
		</p>
		<a
			href="https://github.com/yourusername/tap-recap"
			target="_blank"
			rel="noopener noreferrer"
			class="text-blue-600 hover:underline"
		>
			View on GitHub
		</a>
	</div>
</div>

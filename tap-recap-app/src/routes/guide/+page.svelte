<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<h1 class="mb-6 text-2xl font-bold text-gray-900">Guide</h1>

	<div class="space-y-6">
		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">What is Tap-Recap?</h2>
			<p class="text-gray-700">
				Tap-Recap is a mood-tracking and journalling tool. When you get a feeling, you
				tell the app by just tapping. That's all. Quickly select what fits and move on
				with your busy day.
			</p>
			<p class="mt-2 text-gray-700">
				At the end of the day, you can reflect on the things you tapped and use them as
				prompts for journalling or other reflection — in a notebook, a notes app,
				wherever works for you. Over time, you can view trends in your mood to spot
				patterns.
			</p>
			<p class="mt-2 text-gray-700">
				Your data stays on your device. Nothing is sent to a server.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Tap — log how you feel</h2>
			<p class="mb-3 text-gray-700">
				The <a href="{base}/" class="font-medium text-blue-600 hover:underline">Tap</a> page
				is where you log what happened. Three taps:
			</p>
			<ol class="list-inside list-decimal space-y-2 text-gray-700">
				<li>
					<strong>Mood</strong> — good, meh, or bad?
				</li>
				<li>
					<strong>Who or what</strong> — was it you, someone else, a memory, some media?
				</li>
				<li>
					<strong>What happened</strong> — the options change depending on what you
					picked above.
				</li>
			</ol>
			<p class="mt-3 text-gray-700">
				Done — move on with your day. If you tapped the wrong thing, you can flag it
				straight away.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Recap — journal or reflect</h2>
			<p class="text-gray-700">
				The <a href="{base}/recap" class="font-medium text-blue-600 hover:underline">Recap</a> page
				shows everything you haven't reviewed yet. Think of it as a prompt — read
				through what you logged, then use it as a starting point for journalling or
				other reflection. Mark entries as reviewed when you're done. The journalling
				itself happens wherever you prefer, not in this app.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Calendar — browse by date</h2>
			<p class="text-gray-700">
				The <a href="{base}/calendar" class="font-medium text-blue-600 hover:underline">Calendar</a> page
				shows a monthly view with mood colour-coded counts for each day. Tap on days to
				select them, then view those emotes in Recap or as a Chart.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Chart — spot patterns</h2>
			<p class="text-gray-700">
				The <a href="{base}/chart" class="font-medium text-blue-600 hover:underline">Chart</a> page
				shows your mood trends over time as a line or bar chart. You can change the
				time range to see the bigger picture or zoom into a specific period.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Make it yours</h2>
			<p class="text-gray-700">
				Everything is configurable. In
				<a href="{base}/settings" class="font-medium text-blue-600 hover:underline">Settings</a>,
				you can add, edit, or remove moods, actors, and actions so the options match
				your life. You can also export and import your data as JSON or YAML.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Your data</h2>
			<p class="text-gray-700">
				Everything is stored locally in your browser. Nothing is sent to a server or
				stored in the cloud. This means your data is private, but it also means if you
				clear your browser data, it's gone. Use the
				<a href="{base}/settings/export" class="font-medium text-blue-600 hover:underline">Export</a>
				feature in Settings to back things up regularly.
			</p>
		</div>

		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-3 text-xl font-semibold text-gray-900">Install it</h2>
			<p class="text-gray-700">
				Tap-Recap is a Progressive Web App, so you can install it on your phone or
				computer. Look for "Install" or "Add to Home Screen" in your browser menu.
				Once installed, it works like a regular app — even offline.
			</p>
		</div>
	</div>
</div>

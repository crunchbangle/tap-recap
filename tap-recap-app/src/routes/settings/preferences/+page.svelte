<script lang="ts">
	import { onMount } from 'svelte';
	import { dataService } from '$lib/services/browserStorageService';
	import type { UserPreferences } from '$lib/types';

	let preferences = $state<UserPreferences>({
		configVersionsToKeep: 5,
		sortOrder: 'config',
		reverseOrder: false,
		defaultChartDuration: 14
	});

	let saved = $state(false);

	const sortOptions = [
		{ value: 'config', name: 'Config Order' },
		{ value: 'alphabetic', name: 'Alphabetic' },
		{ value: 'lastUsed', name: 'Last Used' }
	];

	onMount(async () => {
		preferences = await dataService.getPreferences();
	});

	async function savePreferences() {
		await dataService.savePreferences(preferences);
		saved = true;
		setTimeout(() => {
			saved = false;
		}, 2000);
	}
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<div class="mb-4">
		<a
			href="/settings"
			class="inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
		>
			&larr; Back to Settings
		</a>
	</div>

	<h1 class="mb-6 text-2xl font-bold text-gray-900">Preferences</h1>

	<div class="rounded-lg bg-white p-6 shadow">
		<div class="space-y-6">
			<div>
				<label for="config-versions" class="mb-2 block text-sm font-medium text-gray-700">
					Number of Configuration Versions to Keep
				</label>
				<input
					id="config-versions"
					type="number"
					min="1"
					max="20"
					bind:value={preferences.configVersionsToKeep}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
				<p class="mt-1 text-sm text-gray-500">
					Older configuration versions will be automatically removed
				</p>
			</div>

			<div>
				<label for="sort-order" class="mb-2 block text-sm font-medium text-gray-700">
					Default Sort Order
				</label>
				<select
					id="sort-order"
					bind:value={preferences.sortOrder}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					{#each sortOptions as option}
						<option value={option.value}>{option.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-center">
				<input
					id="reverse-order"
					type="checkbox"
					bind:checked={preferences.reverseOrder}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="reverse-order" class="ml-2 text-sm font-medium text-gray-700">
					Reverse Order
				</label>
			</div>

			<div>
				<label for="chart-duration" class="mb-2 block text-sm font-medium text-gray-700">
					Default Chart Duration (days)
				</label>
				<input
					id="chart-duration"
					type="number"
					min="1"
					max="365"
					bind:value={preferences.defaultChartDuration}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				/>
			</div>

			<div class="flex gap-2">
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					onclick={savePreferences}
				>
					Save Preferences
				</button>
				{#if saved}
					<div class="flex items-center text-green-600">
						<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
						<span class="ml-1">Saved!</span>
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

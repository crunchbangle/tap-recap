<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { dataService } from '$lib/services/browserStorageService';
	import type { Mood, AppConfig } from '$lib/types';

	let config = $state<AppConfig | null>(null);
	let editingMood = $state<Mood | null>(null);
	let originalMood = $state<Mood | null>(null);
	let showModal = $state(false);
	let isNew = $state(false);
	let tagWarning = $state<string | null>(null);

	onMount(async () => {
		config = await dataService.getCurrentConfig();
	});

	function addNew() {
		editingMood = { tag: '', displayText: '', color: '#6b7280' };
		originalMood = null;
		isNew = true;
		tagWarning = null;
		showModal = true;
	}

	function edit(mood: Mood) {
		editingMood = { ...mood };
		originalMood = mood;
		isNew = false;
		tagWarning = null;
		showModal = true;
	}

	function checkTagUsage() {
		if (!config || !editingMood || !originalMood) return;

		// Only check if editing and the tag has changed
		if (isNew || editingMood.tag === originalMood.tag) {
			tagWarning = null;
			return;
		}

		// Check if the original tag is used in any actions
		const actionsUsingTag = config.actions.filter(action =>
			action.tags.includes(originalMood!.tag)
		);

		if (actionsUsingTag.length > 0) {
			tagWarning = `Warning: This tag is used by ${actionsUsingTag.length} action(s): ${actionsUsingTag.map(a => a.displayText).join(', ')}. Changing it will break those action filters.`;
		} else {
			tagWarning = null;
		}
	}

	async function save() {
		if (!config || !editingMood) return;
		if (!editingMood.tag || !editingMood.displayText) {
			alert('Please fill in all fields');
			return;
		}

		if (isNew) {
			config.moods.push(editingMood);
		} else if (originalMood) {
			const index = config.moods.findIndex(
				(m) => m.tag === originalMood!.tag && m.displayText === originalMood!.displayText
			);
			if (index !== -1) {
				config.moods[index] = editingMood;
			}
		}

		await dataService.saveConfig(config);
		config = await dataService.getCurrentConfig();
		showModal = false;
	}

	async function deleteMood(mood: Mood) {
		if (!config) return;

		// Check if tag is used by any actions
		const actionsUsingTag = config.actions.filter(action =>
			action.tags.includes(mood.tag)
		);

		let confirmMessage = `Delete mood "${mood.displayText}"?`;
		if (actionsUsingTag.length > 0) {
			confirmMessage += `\n\nWarning: This tag is used by ${actionsUsingTag.length} action(s): ${actionsUsingTag.map(a => a.displayText).join(', ')}. Deleting it will affect those action filters.`;
		}

		if (!confirm(confirmMessage)) return;

		config.moods = config.moods.filter(
			(m) => !(m.tag === mood.tag && m.displayText === mood.displayText)
		);
		await dataService.saveConfig(config);
		config = await dataService.getCurrentConfig();
	}

	function closeModal() {
		showModal = false;
	}
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<div class="mb-4">
		<a
			href="{base}/settings"
			class="inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
		>
			&larr; Back to Settings
		</a>
	</div>

	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Manage Moods</h1>
		<button
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			onclick={addNew}
		>
			Add Mood
		</button>
	</div>

	<div class="rounded-lg bg-white shadow">
		<table class="w-full text-left text-sm text-gray-500">
			<thead class="bg-gray-50 text-xs uppercase text-gray-700">
				<tr>
					<th class="px-6 py-3">Display Text</th>
					<th class="px-6 py-3">Tag</th>
					<th class="px-6 py-3">Chart Color</th>
					<th class="px-6 py-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if config}
					{#each config.moods as mood}
						<tr class="border-b bg-white hover:bg-gray-50">
							<td class="px-6 py-4 text-2xl">{mood.displayText}</td>
							<td class="px-6 py-4">{mood.tag}</td>
							<td class="px-6 py-4">
								<div class="flex items-center gap-2">
									<span
										class="inline-block h-6 w-6 rounded"
										style="background-color: {mood.color}"
									></span>
									<span class="text-xs text-gray-500">{mood.color}</span>
								</div>
							</td>
							<td class="px-6 py-4">
								<div class="flex gap-2">
									<button
										class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-200"
										onclick={() => edit(mood)}
									>
										Edit
									</button>
									<button
										class="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
										onclick={() => deleteMood(mood)}
									>
										Delete
									</button>
								</div>
							</td>
						</tr>
					{/each}
				{/if}
			</tbody>
		</table>
	</div>
</div>

<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onclick={closeModal}>
		<div
			class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="mb-4 text-xl font-semibold">{isNew ? 'Add Mood' : 'Edit Mood'}</h2>

			{#if editingMood}
				<div class="space-y-4">
					<div>
						<label for="display-text" class="mb-2 block text-sm font-medium text-gray-700">
							Display Text
						</label>
						<input
							id="display-text"
							type="text"
							bind:value={editingMood.displayText}
							placeholder="☺️"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="tag" class="mb-2 block text-sm font-medium text-gray-700">Tag</label>
						<input
							id="tag"
							type="text"
							bind:value={editingMood.tag}
							oninput={checkTagUsage}
							placeholder="good"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="color" class="mb-2 block text-sm font-medium text-gray-700">
							Chart Color
						</label>
						<div class="flex items-center gap-3">
							<input
								id="color"
								type="color"
								bind:value={editingMood.color}
								class="h-10 w-14 cursor-pointer rounded border border-gray-300"
							/>
							<input
								type="text"
								bind:value={editingMood.color}
								placeholder="#22c55e"
								class="w-28 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
							/>
						</div>
						<p class="mt-1 text-sm text-gray-500">Used for charts and calendar display</p>
					</div>
					{#if tagWarning}
						<div class="rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
							{tagWarning}
						</div>
					{/if}
				</div>
			{/if}

			<div class="mt-6 flex justify-end gap-2">
				<button
					class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
					onclick={closeModal}
				>
					Cancel
				</button>
				<button
					class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
					onclick={save}
				>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}

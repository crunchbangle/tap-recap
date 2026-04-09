<script lang="ts">
	import { onMount } from 'svelte';
	import { dataService } from '$lib/services/browserStorageService';
	import type { Action, AppConfig } from '$lib/types';

	let config = $state<AppConfig | null>(null);
	let editingAction = $state<Action | null>(null);
	let originalAction = $state<Action | null>(null);
	let showModal = $state(false);
	let isNew = $state(false);
	let tagsInput = $state('');

	onMount(async () => {
		config = await dataService.getCurrentConfig();
	});

	function addNew() {
		editingAction = { tags: [], displayText: '' };
		originalAction = null;
		tagsInput = '';
		isNew = true;
		showModal = true;
	}

	function edit(action: Action) {
		editingAction = { ...action, tags: [...action.tags] };
		originalAction = action;
		tagsInput = action.tags.join(', ');
		isNew = false;
		showModal = true;
	}

	async function save() {
		if (!config || !editingAction) return;
		if (!editingAction.displayText || !tagsInput) {
			alert('Please fill in all fields');
			return;
		}

		editingAction.tags = tagsInput
			.split(',')
			.map((t) => t.trim())
			.filter((t) => t);

		if (isNew) {
			config.actions.push(editingAction);
		} else if (originalAction) {
			const index = config.actions.findIndex((a) => a.displayText === originalAction!.displayText);
			if (index !== -1) {
				config.actions[index] = editingAction;
			}
		}

		await dataService.saveConfig(config);
		config = await dataService.getCurrentConfig();
		showModal = false;
	}

	async function deleteAction(action: Action) {
		if (!config) return;
		if (!confirm(`Delete action "${action.displayText}"?`)) return;

		config.actions = config.actions.filter((a) => a.displayText !== action.displayText);
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
			href="/settings"
			class="inline-block rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
		>
			&larr; Back to Settings
		</a>
	</div>

	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Manage Actions</h1>
		<button
			class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
			onclick={addNew}
		>
			Add Action
		</button>
	</div>

	<div class="rounded-lg bg-white shadow">
		<table class="w-full text-left text-sm text-gray-500">
			<thead class="bg-gray-50 text-xs uppercase text-gray-700">
				<tr>
					<th class="px-6 py-3">Display Text</th>
					<th class="px-6 py-3">Tags</th>
					<th class="px-6 py-3">Actions</th>
				</tr>
			</thead>
			<tbody>
				{#if config}
					{#each config.actions as action}
						<tr class="border-b bg-white hover:bg-gray-50">
							<td class="px-6 py-4">{action.displayText}</td>
							<td class="px-6 py-4">{action.tags.join(', ')}</td>
							<td class="px-6 py-4">
								<div class="flex gap-2">
									<button
										class="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-900 hover:bg-gray-200"
										onclick={() => edit(action)}
									>
										Edit
									</button>
									<button
										class="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-800 hover:bg-red-200"
										onclick={() => deleteAction(action)}
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
			<h2 class="mb-4 text-xl font-semibold">{isNew ? 'Add Action' : 'Edit Action'}</h2>

			{#if editingAction}
				<div class="space-y-4">
					<div>
						<label for="display-text" class="mb-2 block text-sm font-medium text-gray-700">
							Display Text
						</label>
						<input
							id="display-text"
							type="text"
							bind:value={editingAction.displayText}
							placeholder="Great"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
					</div>
					<div>
						<label for="tags" class="mb-2 block text-sm font-medium text-gray-700">
							Tags (comma-separated)
						</label>
						<input
							id="tags"
							type="text"
							bind:value={tagsInput}
							placeholder="felt, good"
							class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<p class="mt-1 text-sm text-gray-500">Example: felt, good</p>
					</div>
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

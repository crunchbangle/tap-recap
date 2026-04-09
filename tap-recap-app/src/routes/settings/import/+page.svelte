<script lang="ts">
	import { dataService } from '$lib/services/browserStorageService';
	import type { ExportFormat } from '$lib/types';

	let format = $state<ExportFormat>('json');
	let importData = $state('');
	let importStatus = $state<{ type: 'success' | 'error'; message: string } | null>(null);

	const formatOptions = [
		{ value: 'json', name: 'JSON' },
		{ value: 'yaml', name: 'YAML' }
	];

	async function handleImport() {
		if (!importData.trim()) {
			importStatus = { type: 'error', message: 'Please paste data to import' };
			return;
		}

		try {
			await dataService.importData(importData, format);
			importStatus = { type: 'success', message: 'Data imported successfully!' };
			importData = '';
		} catch (error) {
			importStatus = { type: 'error', message: 'Import failed: ' + (error as Error).message };
		}
	}

	function handleFileUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];

		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				importData = e.target?.result as string;
			};
			reader.readAsText(file);
		}
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

	<h1 class="mb-6 text-2xl font-bold text-gray-900">Import Data</h1>

	{#if importStatus}
		<div
			class="mb-6 rounded-lg p-4 {importStatus.type === 'success'
				? 'bg-green-100 text-green-800'
				: 'bg-red-100 text-red-800'}"
		>
			{importStatus.message}
		</div>
	{/if}

	<div class="mb-6 rounded-lg bg-white p-6 shadow">
		<div class="space-y-4">
			<div>
				<label for="import-format" class="mb-2 block text-sm font-medium text-gray-700">
					Import Format
				</label>
				<select
					id="import-format"
					bind:value={format}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					{#each formatOptions as option}
						<option value={option.value}>{option.name}</option>
					{/each}
				</select>
			</div>

			<div>
				<label for="file-upload" class="mb-2 block text-sm font-medium text-gray-700">
					Upload File
				</label>
				<input
					id="file-upload"
					type="file"
					accept=".json,.yaml,.yml"
					onchange={handleFileUpload}
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
				/>
			</div>

			<div>
				<label for="import-data" class="mb-2 block text-sm font-medium text-gray-700">
					Or Paste Data
				</label>
				<textarea
					id="import-data"
					bind:value={importData}
					rows={12}
					placeholder="Paste your exported data here..."
					class="w-full rounded-lg border border-gray-300 p-3 font-mono text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				></textarea>
			</div>

			<div class="rounded-lg bg-yellow-50 p-4">
				<p class="text-sm text-yellow-800">
					<strong>Warning:</strong> Importing data will add to your existing emotes and configurations.
					Make sure to backup your current data before importing.
				</p>
			</div>

			<button
				class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				onclick={handleImport}
			>
				Import Data
			</button>
		</div>
	</div>
</div>

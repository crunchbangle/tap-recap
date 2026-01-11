<script lang="ts">
	import { dataService } from '$lib/services/browserStorageService';
	import type { ExportFormat } from '$lib/types';

	let format = $state<ExportFormat>('json');
	let includeAllConfigs = $state(false);
	let exportResult = $state('');
	let showResult = $state(false);

	const formatOptions = [
		{ value: 'json', name: 'JSON' },
		{ value: 'yaml', name: 'YAML' }
	];

	async function handleExport() {
		try {
			exportResult = await dataService.exportData(format, includeAllConfigs);
			showResult = true;
		} catch (error) {
			alert('Export failed: ' + (error as Error).message);
		}
	}

	function downloadFile() {
		const blob = new Blob([exportResult], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `tap-recap-export-${new Date().toISOString().split('T')[0]}.${format}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function copyToClipboard() {
		navigator.clipboard.writeText(exportResult);
		alert('Copied to clipboard!');
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

	<h1 class="mb-6 text-2xl font-bold text-gray-900">Export Data</h1>

	<div class="mb-6 rounded-lg bg-white p-6 shadow">
		<div class="space-y-4">
			<div>
				<label for="format" class="mb-2 block text-sm font-medium text-gray-700">
					Export Format
				</label>
				<select
					id="format"
					bind:value={format}
					class="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
				>
					{#each formatOptions as option}
						<option value={option.value}>{option.name}</option>
					{/each}
				</select>
			</div>

			<div class="flex items-center">
				<input
					id="include-all-configs"
					type="checkbox"
					bind:checked={includeAllConfigs}
					class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
				/>
				<label for="include-all-configs" class="ml-2 text-sm font-medium text-gray-700">
					Include all configuration versions
				</label>
			</div>

			<button
				class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
				onclick={handleExport}
			>
				Export
			</button>
		</div>
	</div>

	{#if showResult}
		<div class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Export Result</h2>
			<div class="mb-4">
				<textarea
					class="h-96 w-full rounded border border-gray-300 p-2 font-mono text-sm"
					readonly
					value={exportResult}
				></textarea>
			</div>
			<div class="flex gap-2">
				<button
					class="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
					onclick={downloadFile}
				>
					Download File
				</button>
				<button
					class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
					onclick={copyToClipboard}
				>
					Copy to Clipboard
				</button>
			</div>
		</div>
	{/if}
</div>

<script lang="ts">
	import { onMount } from 'svelte';
	import { dataService } from '$lib/services/browserStorageService';
	import type { Emote } from '$lib/types';

	let emotes = $state<Emote[]>([]);
	let sortOrder = $state<'asc' | 'desc'>('desc');

	onMount(async () => {
		await loadEmotes();
	});

	async function loadEmotes() {
		emotes = await dataService.getUnreviewedEmotes();
		sortEmotes();
	}

	function sortEmotes() {
		emotes.sort((a, b) => {
			const timeA = new Date(a.timestamp).getTime();
			const timeB = new Date(b.timestamp).getTime();
			return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
		});
		emotes = [...emotes];
	}

	function toggleSortOrder() {
		sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
		sortEmotes();
	}

	async function markReviewed(id: string) {
		await dataService.markEmoteReviewed(id, true);
		await loadEmotes();
	}

	async function markAllReviewed() {
		const ids = emotes.map((e) => e.id);
		await dataService.markAllEmotesReviewed(ids);
		await loadEmotes();
	}

	function formatDate(date: Date): string {
		return new Date(date).toLocaleDateString('en-US', {
			weekday: 'short',
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatTime(date: Date): string {
		return new Date(date).toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold text-gray-900">Recap</h1>
		<div class="flex gap-2">
			<button
				class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
				onclick={toggleSortOrder}
			>
				Sort: {sortOrder === 'asc' ? 'Oldest First' : 'Newest First'}
			</button>
			{#if emotes.length > 0}
				<button
					class="rounded-lg bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700"
					onclick={markAllReviewed}
				>
					Mark All Reviewed
				</button>
			{/if}
		</div>
	</div>

	{#if emotes.length === 0}
		<div class="rounded-lg bg-white p-6 text-center shadow">
			<p class="text-gray-500">No unreviewed emotes. Great job staying on top of things!</p>
		</div>
	{:else}
		<div class="space-y-4">
			{#each emotes as emote}
				<div class="rounded-lg border-l-4 border-blue-500 bg-white p-4 shadow">
					<div class="flex items-start justify-between">
						<div class="flex-1">
							<div class="mb-2 flex items-center gap-2">
								<span class="text-2xl">{emote.mood}</span>
								<span class="font-semibold text-gray-700">{emote.actor}</span>
								<span class="text-gray-600">{emote.action}</span>
							</div>

							<div class="mb-2 flex gap-2 text-sm text-gray-500">
								<span>{formatDate(emote.timestamp)}</span>
								<span>{formatTime(emote.timestamp)}</span>
							</div>

							{#if emote.flags}
								<div class="flex gap-2">
									{#if emote.flags.mistake}
										<span class="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Mistake</span>
									{/if}
									{#if emote.flags.earlierTime}
										<span class="rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">Earlier Time</span>
									{/if}
									{#if emote.flags.contextNotRight}
										<span class="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">Context Not Right</span>
									{/if}
								</div>
							{/if}
						</div>

						<button
							class="rounded-lg bg-green-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-green-700"
							onclick={() => markReviewed(emote.id)}
						>
							Mark Reviewed
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>

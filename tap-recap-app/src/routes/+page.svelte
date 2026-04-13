<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { dataService } from '$lib/services/browserStorageService';
	import { filterActions } from '$lib/utils/filterActions';
	import type { Mood, Actor, Action, AppConfig } from '$lib/types';

	let config = $state<AppConfig | null>(null);
	let selectedMood = $state<Mood | null>(null);
	let selectedActor = $state<Actor | null>(null);
	let filteredActions = $state<Action[]>([]);
	let showToast = $state(false);
	let toastMessage = $state('');
	let showFlags = $state(false);
	let currentEmoteId = $state<string | null>(null);

	onMount(async () => {
		config = await dataService.getCurrentConfig();
		const logged = new URLSearchParams(window.location.search).get('logged');
		if (logged) {
			toastMessage = `Logged: ${logged}`;
			showToast = true;
			setTimeout(() => { showToast = false; }, 3000);
			history.replaceState({}, '', window.location.pathname);
		}
	});

	function selectMood(mood: Mood) {
		if (selectedMood?.tag === mood.tag) {
			selectedMood = null;
		} else {
			selectedMood = mood;
		}
		updateFilteredActions();
	}

	function selectActor(actor: Actor) {
		if (selectedActor?.displayText === actor.displayText) {
			selectedActor = null;
		} else {
			selectedActor = actor;
		}
		updateFilteredActions();
	}

	function updateFilteredActions() {
		if (!config) return;
		filteredActions = filterActions(config.actions, selectedMood?.tag, selectedActor?.tag);
	}

	async function selectAction(action: Action) {
		if (!selectedMood || !selectedActor) return;

		const emoteId = await dataService.logEmote({
			timestamp: new Date(),
			mood: selectedMood.displayText,
			actor: selectedActor.displayText,
			action: action.displayText,
			reviewed: false
		});

		currentEmoteId = emoteId;
		toastMessage = `Logged: ${selectedMood.displayText} ${selectedActor.displayText} ${action.displayText}`;
		showToast = true;
		showFlags = true;

		setTimeout(() => {
			showToast = false;
		}, 3000);
	}

	async function flagEmote(flag: 'mistake' | 'earlierTime' | 'contextNotRight') {
		if (!currentEmoteId) return;

		const emotes = await dataService.getEmotes();
		const emote = emotes.find((e) => e.id === currentEmoteId);
		if (emote) {
			const flags = emote.flags || {};
			flags[flag] = true;
			await dataService.updateEmote(currentEmoteId, { flags });
			toastMessage = `Flagged as ${flag.replace(/([A-Z])/g, ' $1').toLowerCase()}`;
			showToast = true;
			setTimeout(() => {
				showToast = false;
			}, 2000);
		}
	}

	function newEmote() {
		selectedMood = null;
		selectedActor = null;
		filteredActions = [];
		showFlags = false;
		currentEmoteId = null;
	}
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<div class="space-y-6">
		<!-- Moods Section -->
		<div class="rounded-lg bg-white p-4 shadow">
			<h2 class="mb-3 text-sm font-semibold text-gray-700">Mood</h2>
			<div class="flex flex-wrap gap-2">
				{#if config}
					{#each config.moods as mood}
						<button
							class="rounded-lg px-5 py-2.5 text-2xl font-medium transition-colors {selectedMood?.tag ===
							mood.tag
								? 'bg-blue-700 text-white'
								: 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
							onclick={() => selectMood(mood)}
						>
							{mood.displayText}
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Actors Section -->
		<div class="rounded-lg bg-white p-4 shadow">
			<h2 class="mb-3 text-sm font-semibold text-gray-700">Actor</h2>
			<div class="flex flex-wrap gap-2">
				{#if config}
					{#each config.actors as actor}
						<button
							class="rounded-lg px-3 py-1.5 text-sm font-medium transition-colors {selectedActor?.displayText ===
							actor.displayText
								? 'bg-blue-700 text-white'
								: 'bg-gray-100 text-gray-900 hover:bg-gray-200'}"
							onclick={() => selectActor(actor)}
						>
							{actor.displayText}
						</button>
					{/each}
				{/if}
			</div>
		</div>

		<!-- Actions Section -->
		<div class="rounded-lg bg-white p-4 shadow">
			<h2 class="mb-3 text-sm font-semibold text-gray-700">Action</h2>
			{#if filteredActions.length > 0}
				<div class="flex flex-wrap gap-2">
					{#each filteredActions as action}
						<button
							class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-200"
							onclick={() => selectAction(action)}
						>
							{action.displayText}
						</button>
					{/each}
					{#if selectedMood && selectedActor}
						<a
							href="{base}/settings/actions?tags={encodeURIComponent(selectedActor.tag + ', ' + selectedMood.tag)}&mood={encodeURIComponent(selectedMood.displayText)}&actor={encodeURIComponent(selectedActor.displayText)}"
							class="rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-200"
						>
							+
						</a>
					{/if}
				</div>
			{:else if selectedMood || selectedActor}
				<p class="text-sm text-gray-500">Select both a mood and an actor to see actions</p>
			{:else}
				<p class="text-sm text-gray-500">Select a mood and an actor to see available actions</p>
			{/if}
		</div>

		<!-- Flags and New Emote Section -->
		{#if showFlags}
			<div class="rounded-lg bg-white p-4 shadow">
				<h3 class="mb-3 text-sm font-semibold text-gray-700">Options</h3>
				<div class="flex flex-wrap gap-2">
					<button
						class="rounded-lg bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200"
						onclick={() => flagEmote('mistake')}
					>
						Mark as Mistake
					</button>
					<button
						class="rounded-lg bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200"
						onclick={() => flagEmote('earlierTime')}
					>
						Earlier Time
					</button>
					<button
						class="rounded-lg bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800 hover:bg-yellow-200"
						onclick={() => flagEmote('contextNotRight')}
					>
						Context Not Right
					</button>
				</div>
				<div class="mt-4">
					<button
						class="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white hover:bg-green-700"
						onclick={newEmote}
					>
						New Emote
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<!-- Toast Notification -->
{#if showToast}
	<div class="fixed bottom-4 right-4 z-50">
		<div class="flex items-center rounded-lg bg-green-100 p-4 text-green-800 shadow-lg">
			<svg class="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clip-rule="evenodd"
				></path>
			</svg>
			{toastMessage}
		</div>
	</div>
{/if}

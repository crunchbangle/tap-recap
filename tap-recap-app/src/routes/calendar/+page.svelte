<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';
	import { dataService } from '$lib/services/browserStorageService';
	import type { Emote, AppConfig, Mood } from '$lib/types';

	let currentDate = $state(new Date());
	let config = $state<AppConfig | null>(null);
	let emotes = $state<Emote[]>([]);
	let selectedDates = $state<Date[]>([]);

	onMount(async () => {
		config = await dataService.getCurrentConfig();
		emotes = await dataService.getEmotes();
	});

	function getDaysInMonth(date: Date): Date[] {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const days: Date[] = [];

		// Add padding days from previous month
		const firstDayOfWeek = firstDay.getDay();
		for (let i = firstDayOfWeek - 1; i >= 0; i--) {
			const prevDate = new Date(year, month, -i);
			days.push(prevDate);
		}

		// Add days of current month
		for (let i = 1; i <= lastDay.getDate(); i++) {
			days.push(new Date(year, month, i));
		}

		// Add padding days from next month
		const remainingDays = 7 - (days.length % 7);
		if (remainingDays < 7) {
			for (let i = 1; i <= remainingDays; i++) {
				days.push(new Date(year, month + 1, i));
			}
		}

		return days;
	}

	function getEmotesForDate(date: Date): Emote[] {
		return emotes.filter((emote) => {
			const emoteDate = new Date(emote.timestamp);
			return (
				emoteDate.getDate() === date.getDate() &&
				emoteDate.getMonth() === date.getMonth() &&
				emoteDate.getFullYear() === date.getFullYear()
			);
		});
	}

	function getMoodCountsForDate(date: Date): Map<string, number> {
		const dayEmotes = getEmotesForDate(date);
		const counts = new Map<string, number>();

		dayEmotes.forEach((emote) => {
			const current = counts.get(emote.mood) || 0;
			counts.set(emote.mood, current + 1);
		});

		return counts;
	}

	function getTotalEmotesForDate(date: Date): number {
		return getEmotesForDate(date).length;
	}

	function getMoodByDisplayText(displayText: string): Mood | undefined {
		return config?.moods.find((m) => m.displayText === displayText);
	}

	function previousMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
	}

	function toggleDateSelection(date: Date) {
		const dateStr = date.toDateString();
		const index = selectedDates.findIndex((d) => d.toDateString() === dateStr);

		if (index > -1) {
			selectedDates.splice(index, 1);
		} else {
			selectedDates.push(date);
		}
		selectedDates = [...selectedDates];
	}

	function isDateSelected(date: Date): boolean {
		return selectedDates.some((d) => d.toDateString() === date.toDateString());
	}

	function isCurrentMonth(date: Date): boolean {
		return date.getMonth() === currentDate.getMonth();
	}

	function viewSelectedEmotes() {
		if (selectedDates.length === 0) return;

		const startDate = new Date(Math.min(...selectedDates.map((d) => d.getTime())));
		const endDate = new Date(Math.max(...selectedDates.map((d) => d.getTime())));

		// Store the date range in sessionStorage for the recap page
		sessionStorage.setItem('dateFilter', JSON.stringify({ startDate, endDate }));
		goto(`${base}/recap`);
	}

	function viewSelectedChart() {
		if (selectedDates.length === 0) return;

		const startDate = new Date(Math.min(...selectedDates.map((d) => d.getTime())));
		const endDate = new Date(Math.max(...selectedDates.map((d) => d.getTime())));

		sessionStorage.setItem('dateFilter', JSON.stringify({ startDate, endDate }));
		goto(`${base}/chart`);
	}

	const monthYear = $derived(
		currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
	);
	const days = $derived(getDaysInMonth(currentDate));
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<div class="mb-6">
		<h1 class="mb-4 text-2xl font-bold text-gray-900">Calendar</h1>

		<!-- Month Navigation -->
		<div class="mb-4 flex items-center justify-between">
			<button
				class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
				onclick={previousMonth}
			>
				&larr; Previous
			</button>
			<h2 class="text-xl font-semibold">{monthYear}</h2>
			<button
				class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
				onclick={nextMonth}
			>
				Next &rarr;
			</button>
		</div>

		<!-- Day Headers -->
		<div class="mb-2 grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-700">
			<div>Sun</div>
			<div>Mon</div>
			<div>Tue</div>
			<div>Wed</div>
			<div>Thu</div>
			<div>Fri</div>
			<div>Sat</div>
		</div>

		<!-- Calendar Grid -->
		<div class="grid grid-cols-7 gap-2">
			{#each days as day}
				{@const moodCounts = getMoodCountsForDate(day)}
				{@const hasEmotes = getTotalEmotesForDate(day) > 0}
				{@const selected = isDateSelected(day)}
				{@const inCurrentMonth = isCurrentMonth(day)}
				<button
					class="aspect-square rounded-lg border p-2 text-sm transition-colors
						{selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
						{!inCurrentMonth ? 'text-gray-400' : 'text-gray-900'}
						{hasEmotes ? 'font-bold' : ''}
						hover:border-blue-300"
					onclick={() => toggleDateSelection(day)}
				>
					<div class="text-center">{day.getDate()}</div>
					{#if hasEmotes && config}
						<div class="mt-1 flex flex-wrap justify-center gap-1 text-xs">
							{#each Array.from(moodCounts.entries()) as [moodDisplay, count]}
								{@const mood = getMoodByDisplayText(moodDisplay)}
								{#if mood}
									<span style="color: {mood.color};">{count}</span>
								{:else}
									<span class="text-gray-500">{count}</span>
								{/if}
							{/each}
						</div>
					{/if}
				</button>
			{/each}
		</div>

		<!-- Selected Dates Actions -->
		{#if selectedDates.length > 0}
			<div class="mt-6 rounded-lg bg-white p-6 shadow">
				<p class="mb-4 text-sm text-gray-700">
					{selectedDates.length} date{selectedDates.length > 1 ? 's' : ''} selected
				</p>
				<div class="flex gap-2">
					<button
						class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
						onclick={viewSelectedEmotes}
					>
						View Emotes
					</button>
					<button
						class="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700"
						onclick={viewSelectedChart}
					>
						View Chart
					</button>
					<button
						class="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
						onclick={() => (selectedDates = [])}
					>
						Clear Selection
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

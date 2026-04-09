<script lang="ts">
	import { onMount } from 'svelte';
	import { Chart, registerables } from 'chart.js';
	import { dataService } from '$lib/services/browserStorageService';
	import type { Emote, AppConfig, Mood } from '$lib/types';

	Chart.register(...registerables);

	let canvas: HTMLCanvasElement;
	let chart: Chart | null = null;
	let config = $state<AppConfig | null>(null);
	let emotes = $state<Emote[]>([]);
	let chartType = $state<'line' | 'bar'>('line');
	let duration = $state(14); // days

	onMount(async () => {
		config = await dataService.getCurrentConfig();

		// Check for date filter from calendar
		const dateFilterStr = sessionStorage.getItem('dateFilter');
		if (dateFilterStr) {
			const { startDate, endDate } = JSON.parse(dateFilterStr);
			emotes = await dataService.getEmotes(new Date(startDate), new Date(endDate));
			sessionStorage.removeItem('dateFilter');
		} else {
			await loadEmotes();
		}

		renderChart();
	});

	async function loadEmotes() {
		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - duration);
		emotes = await dataService.getEmotes(startDate, endDate);
	}

	async function changeDuration(days: number) {
		duration = days;
		await loadEmotes();
		renderChart();
	}

	function toggleChartType() {
		chartType = chartType === 'line' ? 'bar' : 'line';
		renderChart();
	}

	function hexToRgb(hex: string): { r: number; g: number; b: number } {
		const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result
			? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				}
			: { r: 107, g: 114, b: 128 }; // fallback gray
	}

	function getMoodCount(mood: Mood): number {
		return emotes.filter((e) => e.mood === mood.displayText).length;
	}

	function renderChart() {
		if (!canvas || !config) return;

		// Destroy existing chart
		if (chart) {
			chart.destroy();
		}

		// Build a map of date -> { moodDisplayText -> count }
		const dateMap = new Map<string, Map<string, number>>();

		emotes.forEach((emote) => {
			const date = new Date(emote.timestamp);
			const dateKey = date.toISOString().split('T')[0];

			if (!dateMap.has(dateKey)) {
				dateMap.set(dateKey, new Map());
			}

			const moodCounts = dateMap.get(dateKey)!;
			const currentCount = moodCounts.get(emote.mood) || 0;
			moodCounts.set(emote.mood, currentCount + 1);
		});

		// Sort dates and prepare chart data
		const sortedDates = Array.from(dateMap.keys()).sort();
		const labels = sortedDates.map((date) =>
			new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
		);

		// Create datasets dynamically from config moods
		const datasets = config.moods.map((mood) => {
			const rgb = hexToRgb(mood.color);
			const data = sortedDates.map((date) => {
				const moodCounts = dateMap.get(date);
				return moodCounts?.get(mood.displayText) || 0;
			});

			return {
				label: mood.displayText,
				data,
				borderColor: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
				backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`,
				tension: 0.1
			};
		});

		// Create chart
		chart = new Chart(canvas, {
			type: chartType,
			data: {
				labels,
				datasets
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: 'Emote Trends'
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							stepSize: 1
						}
					}
				}
			}
		});
	}

	$effect(() => {
		if (canvas && emotes && config) {
			renderChart();
		}
	});
</script>

<div class="container mx-auto max-w-4xl px-4 pt-20">
	<div class="mb-6">
		<h1 class="mb-4 text-2xl font-bold text-gray-900">Chart</h1>

		<!-- Controls -->
		<div class="mb-4 flex flex-wrap gap-4">
			<div>
				<p class="mb-2 text-sm font-semibold text-gray-700">Duration</p>
				<div class="inline-flex rounded-lg shadow-sm">
					<button
						class="rounded-l-lg border px-3 py-1.5 text-sm font-medium transition-colors {duration === 7
							? 'border-blue-600 bg-blue-600 text-white'
							: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}"
						onclick={() => changeDuration(7)}
					>
						7 Days
					</button>
					<button
						class="border-y px-3 py-1.5 text-sm font-medium transition-colors {duration === 14
							? 'border-blue-600 bg-blue-600 text-white'
							: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}"
						onclick={() => changeDuration(14)}
					>
						14 Days
					</button>
					<button
						class="border-y px-3 py-1.5 text-sm font-medium transition-colors {duration === 30
							? 'border-blue-600 bg-blue-600 text-white'
							: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}"
						onclick={() => changeDuration(30)}
					>
						30 Days
					</button>
					<button
						class="rounded-r-lg border px-3 py-1.5 text-sm font-medium transition-colors {duration === 90
							? 'border-blue-600 bg-blue-600 text-white'
							: 'border-gray-200 bg-white text-gray-900 hover:bg-gray-50'}"
						onclick={() => changeDuration(90)}
					>
						90 Days
					</button>
				</div>
			</div>

			<div>
				<p class="mb-2 text-sm font-semibold text-gray-700">Chart Type</p>
				<button
					class="rounded-lg bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-gray-200"
					onclick={toggleChartType}
				>
					{chartType === 'line' ? 'Line Chart' : 'Bar Chart'}
				</button>
			</div>
		</div>

		<!-- Chart -->
		<div class="rounded-lg bg-white p-4 shadow">
			<div class="h-96">
				<canvas bind:this={canvas}></canvas>
			</div>
		</div>

		<!-- Summary Stats -->
		{#if emotes.length > 0 && config}
			<div class="mt-4 rounded-lg bg-white p-6 shadow">
				<h3 class="mb-3 text-lg font-semibold">Summary</h3>
				<div class="grid gap-4 text-center" style="grid-template-columns: repeat({config.moods.length}, minmax(0, 1fr));">
					{#each config.moods as mood}
						{@const count = getMoodCount(mood)}
						<div>
							<div class="text-3xl font-bold" style="color: {mood.color};">{count}</div>
							<div class="text-sm text-gray-600">{mood.displayText}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</div>

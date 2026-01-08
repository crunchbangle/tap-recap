<script lang="ts">

import {taps, moods, actors, actions} from './storage'
import type {Tap, Mood, Actor, Action} from './storage'

import { Toast, Card } from "flowbite-svelte"
import { FireOutline } from "flowbite-svelte-icons";
import { slide } from "svelte/transition";

let toastStatus = $state(false);
let counter = $state(6);

function trigger() {
    toastStatus = true;
    counter = 6;
    timeout();
}

function timeout() {
    if (--counter > 0) return setTimeout(timeout, 1000);
    toastStatus = false;
}

let latestTap: Tap|null = $state(null);

let loaded = $state(false);

taps.subscribe((taps) => {
    if(! loaded){
        loaded = true;
        return;
    }
    latestTap = taps[taps.length-1]
    trigger();
});

// ui state
let selectedActor: Actor|null = $state(null);
let selectedMood: Mood|null = $state(null);

let visibleActors = $derived($actors.filter(x => selectedActor == null || selectedActor.text == x.text));

let visibleMoods = $derived($moods.filter(x => selectedMood == null || selectedMood.text == x.text));

let visibleActions = $derived($actions.filter(x =>
    selectedMood != null &&
    selectedActor != null &&
    x.tags.includes(selectedActor.tag) &&
    x.tags.includes(selectedMood.tag)
))

</script>


<Toast color="indigo" transition={slide} dismissable={false} bind:toastStatus class="w-full max-w-none">
    {#snippet icon()}
        <FireOutline class="h-6 w-6" />
    {/snippet}
    {latestTap?.actor} {latestTap?.event} ({latestTap?.mood}) {counter}
</Toast>

<div class="flex flex-col  w-full gap-4 h-[calc(100vh-8rem)] pb-20">
  <Card class="flex-1 flex flex-col w-full">
    <div class="flex-1 flex flex-wrap gap-3 content-center justify-center">
      {#each visibleMoods as item2}
      <button
        class="px-8 py-6 text-3xl rounded-lg border-2 transition-all {selectedMood?.text === item2.text ? 'border-primary-500 bg-primary-100 dark:bg-primary-900 text-gray-900 dark:text-gray-100' : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 text-gray-900 dark:text-gray-100'}"
        onclick={() => {
          selectedMood = selectedMood != null && selectedMood.text === item2.text ? null : item2;
        }}>{item2.text}</button>
      {/each}
    </div>
  </Card>

  <Card class="flex-1 flex flex-col w-full">
    <div class="flex-1 flex flex-wrap gap-3 content-center justify-center">
      {#each visibleActors as item1}
      <button
        class="px-6 py-4 text-base rounded-lg border-2 transition-all min-w-[120px] {selectedActor?.text === item1.text ? 'border-primary-500 bg-primary-100 dark:bg-primary-900 text-gray-900 dark:text-gray-100' : 'border-gray-300 dark:border-gray-600 hover:border-primary-300 text-gray-900 dark:text-gray-100'}"
        onclick={() => {
          selectedActor = selectedActor != null && selectedActor.text === item1.text ? null : item1;
        }}>{item1.text}</button>
      {/each}
    </div>
  </Card>

  <Card class="flex-1 flex flex-col w-full">
    <div class="flex-1 flex flex-wrap gap-3 content-center justify-center">
      {#each visibleActions as action}
      <button
        class="px-8 py-5 text-lg font-medium rounded-lg border-2 border-green-500 bg-green-50 dark:bg-green-900 hover:bg-green-100 dark:hover:bg-green-800 transition-all min-w-[140px] text-gray-900 dark:text-gray-100"
        onclick={()=>taps.update(x => {
          const now = new Date().toISOString();
          x.push({
              "datetime": now,
              "actor": selectedActor!.text,
              "mood": selectedMood!.text,
              "event": action.text});
          selectedActor = null;
          selectedMood = null;
          return x
        })}>{action.text}</button>
      {/each}
    </div>
  </Card>
</div>

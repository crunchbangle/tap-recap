<script lang="ts">

import {taps} from './storage'
import type {Tap} from './storage'

import { Toast,Card } from "flowbite-svelte"
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

interface Tagger {
    text: string;
    tag: string;
}
interface Tagged {
    text: string;
    tags: string[];
}

let selectedActor: Tagger|null = $state(null);
let selectedMood: Tagger|null = $state(null);

const actors: Tagger[] = [
  {"text": "I felt", "tag": "felt"}, 
  {"text": "I did", "tag":"did"}, 
  {"text":"A friend","tag":"others"},
  {"text":"Family","tag":"others"}, 
  {"text":"A stranger","tag":"others"}, 
  {"text":"A peer/colleague","tag":"others"}
  ]

const moods: Tagger[] = [
  {"text":"🙂","tag":"good"}, 
  {"text":"😐","tag":"meh"}, 
  {"text":"🙁","tag":"bad"}]

const line3: Tagged[] = [
  {"text":"great","tags":["felt","did","good"]}
]

let visibleActors = $derived(actors.filter(x => selectedActor == null || selectedActor.text == x.text));

let visibleMoods = $derived(moods.filter(x => selectedMood == null || selectedMood.text == x.text));

let visible3 = $derived(line3.filter(x => 
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

<Card>
Mood
<div class="flex flex-wrap justify-around">
{#each visibleMoods as item2}
<button
  class="px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
  onclick={() => {
    selectedMood = selectedMood != null && selectedMood.text === item2.text ? null : item2;
  }}>{item2.text}</button>
{/each}
</div>
</Card>

<Card>
Actor
<div class="flex flex-wrap justify-around">
{#each visibleActors as item1}
<button
  class="px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
  onclick={() => {
    selectedActor = selectedActor != null && selectedActor.text === item1.text ? null : item1;
  }}>{item1.text}</button>
{/each}
</div>
</Card>

<Card>
Event
<div class="flex flex-wrap justify-around">
{#each visible3 as event}
<button
  class="px-3 py-2 rounded border border-gray-300 dark:border-gray-600"
  onclick={()=>taps.update(x => {
    const now = new Date().toISOString();
    x.push({
        "datetime": now, 
        "actor": selectedActor!.text, 
        "mood": selectedMood!.text,
        "event": event.text}); 
    selectedActor = null;
    selectedMood = null;
    return x
  })}>{event.text}</button> <!-- add onclick that adds an event to the log -->
{/each}
</div>
</Card>

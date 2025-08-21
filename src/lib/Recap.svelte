<script lang="ts">
import { Card, Button } from "flowbite-svelte"
import {  CaretRightOutline, CaretLeftOutline, CalendarWeekOutline } from "flowbite-svelte-icons"
import {taps} from './storage'

</script>

<p>Obviously, there's a lot more to do here!</p>

<p>I want to have it so you can navigate days, better formatting, 
    and maybe some checked state for whether the user has reflected on it yet?</p>

<p>also need to sort out formatting!!!!</p>

<Card>
    {new Date().toISOString()}
<Button><CaretLeftOutline  class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" /></Button>
<Button><CalendarWeekOutline  class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" /></Button>
<Button><CaretRightOutline  class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" /></Button>
</Card>


{#each $taps as tap}

<Card>
    {tap.datetime} {tap.mood} {tap.actor} {tap.event}
</Card>

{/each}
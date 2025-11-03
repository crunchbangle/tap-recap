<script lang="ts">

import { BottomNav, BottomNavItem } from "flowbite-svelte";
import { TableRowOutline, CogOutline, CirclePlusOutline, ChartOutline, CalendarMonthOutline } from "flowbite-svelte-icons";
import Tap from "./Tap.svelte";
import Recap from "./Recap.svelte";
import Settings from "./Settings.svelte";
import Chart from "./Chart.svelte";
import Days from "./Days.svelte";

let selectedTab = $state("tap");

</script>

{#if selectedTab==="tap"}
<Tap/>
{/if}

{#if selectedTab==="recap"}
<Recap/>
{/if}

{#if selectedTab==="days"}
<Days/>
{/if}

{#if selectedTab==="chart"}
<Chart/>
{/if}

{#if selectedTab==="settings"}
<Settings/>
{/if}


<BottomNav position="absolute" classes={{"inner": "grid-cols-5 grid gap-4 mb-6"}}>
  <BottomNavItem btnName="Tap" onclick={()=>selectedTab="tap"}>
    <CirclePlusOutline class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
  <BottomNavItem btnName="Recap" onclick={()=>selectedTab="recap"}>
    <TableRowOutline class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
  <BottomNavItem btnName="Days" onclick={()=>selectedTab="days"}>
    <CalendarMonthOutline class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
  <BottomNavItem btnName="Chart" onclick={()=>selectedTab="chart"}>
    <ChartOutline class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
  <BottomNavItem btnName="Settings" onclick={()=>selectedTab="settings"}>
    <CogOutline class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
</BottomNav>

 


<script lang="ts">

import { BottomNav, BottomNavItem } from "flowbite-svelte";
import { TableRowSolid, CogSolid,  CirclePlusSolid  } from "flowbite-svelte-icons";
import Tap from "./Tap.svelte";
import Recap from "./Recap.svelte";
import Settings from "./Settings.svelte";

let selectedTab = $state("tap");

</script>

{#if selectedTab=="tap"}
<Tap/>
{/if}

{#if selectedTab=="recap"}
<Recap/>
{/if}

{#if selectedTab=="settings"}
<Settings/>
{/if}


<BottomNav position="absolute" classes={{ inner: "grid-cols-4" }}>
  <BottomNavItem btnName="Tap" onclick={()=>selectedTab="tap"}>
    <CirclePlusSolid class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
  <BottomNavItem btnName="Recap" onclick={()=>selectedTab="recap"}>
    <TableRowSolid class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
  <BottomNavItem btnName="Settings" onclick={()=>selectedTab="settings"}>
    <CogSolid class="group-hover:text-primary-600 dark:group-hover:text-primary-500 mb-1 h-6 w-6 text-gray-500 dark:text-gray-400" />
  </BottomNavItem>
</BottomNav>



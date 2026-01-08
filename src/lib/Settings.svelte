<script lang="ts">
import { Card, Button, Heading } from "flowbite-svelte"
import MoodsEditor from "./MoodsEditor.svelte"
import ActorsEditor from "./ActorsEditor.svelte"
import GroupsEditor from "./GroupsEditor.svelte"
import ActionsEditor from "./ActionsEditor.svelte"

type SettingsView = 'main' | 'moods' | 'actors' | 'groups' | 'actions'

let currentView = $state<SettingsView>('main')

function showView(view: SettingsView) {
  currentView = view
}

function showMain() {
  currentView = 'main'
}
</script>

{#if currentView === 'main'}
<div class="flex flex-col gap-4 p-4 h-screen pb-24">
  <Heading tag="h2" class="text-center mb-4">Settings</Heading>

  <Card class="flex flex-col gap-3">
    <Heading tag="h3" class="text-lg text-gray-900 dark:text-gray-100">Configuration</Heading>
    <Button color="light"  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => showView('moods')}>Manage Moods</Button>
    <Button color="light"  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => showView('actors')}>Manage Actors</Button>
    <Button color="light"  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => showView('groups')}>Manage Groups</Button>
    <Button color="light"  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => showView('actions')}>Manage Actions</Button>
  </Card>

  <Card class="flex flex-col gap-3">
    <Heading tag="h3" class="text-lg text-gray-900 dark:text-gray-100">Data Management</Heading>
    <Button color="light" class="text-gray-900 dark:text-gray-100" disabled>Import Settings</Button>
    <Button color="light" class="text-gray-900 dark:text-gray-100" disabled>Import Log</Button>
    <Button color="light" class="text-gray-900 dark:text-gray-100" disabled>Export Settings</Button>
    <Button color="light" class="text-gray-900 dark:text-gray-100" disabled>Export Log</Button>
  </Card>
</div>
{:else if currentView === 'moods'}
  <MoodsEditor onBack={showMain} />
{:else if currentView === 'actors'}
  <ActorsEditor onBack={showMain} />
{:else if currentView === 'groups'}
  <GroupsEditor onBack={showMain} />
{:else if currentView === 'actions'}
  <ActionsEditor onBack={showMain} />
{/if}

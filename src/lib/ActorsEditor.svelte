<script lang="ts">
import { Card, Button, Input, Label, Select } from "flowbite-svelte"
import { PlusOutline, TrashBinOutline, CheckOutline, CloseOutline } from "flowbite-svelte-icons"
import { actors, groups } from './storage'
import type { Actor } from './storage'

interface Props {
  onBack: () => void
}

let { onBack }: Props = $props()

let editingId: string | null = $state(null)
let newActor = $state({ text: '', tag: '' })
let editActor = $state({ text: '', tag: '' })

let groupOptions = $derived($groups.map(g => ({ value: g.tag, name: g.name })))

function startAdd() {
  editingId = 'new'
  newActor = { text: '', tag: '' }
}

function cancelAdd() {
  editingId = null
  newActor = { text: '', tag: '' }
}

function addActor() {
  if (!newActor.text.trim() || !newActor.tag.trim()) return

  actors.update(items => {
    const newId = Date.now().toString()
    return [...items, { id: newId, text: newActor.text, tag: newActor.tag }]
  })

  cancelAdd()
}

function startEdit(actor: Actor) {
  editingId = actor.id
  editActor = { text: actor.text, tag: actor.tag }
}

function cancelEdit() {
  editingId = null
  editActor = { text: '', tag: '' }
}

function saveEdit(id: string) {
  if (!editActor.text.trim() || !editActor.tag.trim()) return

  actors.update(items =>
    items.map(item =>
      item.id === id
        ? { ...item, text: editActor.text, tag: editActor.tag }
        : item
    )
  )

  cancelEdit()
}

function deleteActor(id: string) {
  if (confirm('Are you sure you want to delete this actor?')) {
    actors.update(items => items.filter(item => item.id !== id))
  }
}
</script>

<div class="flex flex-col gap-4 p-4 h-screen pb-24">
  <div class="flex items-center justify-between mb-4">
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={onBack}>← Back</Button>
    <h2 class="text-2xl font-bold">Manage Actors</h2>
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={startAdd} disabled={editingId !== null}>
      <PlusOutline class="w-5 h-5 mr-2" />
      Add
    </Button>
  </div>

  {#if editingId === 'new'}
  <Card class="bg-green-50 dark:bg-green-900">
    <div class="flex flex-col gap-3">
      <div>
        <Label>Display Text</Label>
        <Input bind:value={newActor.text} placeholder="I felt" />
      </div>
      <div>
        <Label>Group (tag)</Label>
        <Select bind:value={newActor.tag} items={groupOptions} placeholder="Select a group" />
      </div>
      <div class="flex gap-2">
        <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={addActor}>
          <CheckOutline class="w-5 h-5 mr-2" />
          Save
        </Button>
        <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={cancelAdd}>
          <CloseOutline class="w-5 h-5 mr-2" />
          Cancel
        </Button>
      </div>
    </div>
  </Card>
  {/if}

  <div class="flex flex-col gap-3 overflow-y-auto">
    {#each $actors as actor (actor.id)}
      <Card>
        {#if editingId === actor.id}
          <div class="flex flex-col gap-3">
            <div>
              <Label>Display Text</Label>
              <Input bind:value={editActor.text} />
            </div>
            <div>
              <Label>Group (tag)</Label>
              <Select bind:value={editActor.tag} items={groupOptions} />
            </div>
            <div class="flex gap-2">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => saveEdit(actor.id)}>
                <CheckOutline class="w-5 h-5 mr-2" />
                Save
              </Button>
              <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={cancelEdit}>
                <CloseOutline class="w-5 h-5 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        {:else}
          <div class="flex items-center justify-between">
            <div class="flex-1">
              <div class="text-lg font-semibold mb-1">{actor.text}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Group: {$groups.find(g => g.tag === actor.tag)?.name || actor.tag}
              </div>
            </div>
            <div class="flex gap-2">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => startEdit(actor)} disabled={editingId !== null}>
                Edit
              </Button>
              <Button  class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => deleteActor(actor.id)} disabled={editingId !== null}>
                <TrashBinOutline class="w-4 h-4" />
              </Button>
            </div>
          </div>
        {/if}
      </Card>
    {/each}
  </div>
</div>

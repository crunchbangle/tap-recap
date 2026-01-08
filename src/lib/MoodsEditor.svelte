<script lang="ts">
import { Card, Button, Input, Label } from "flowbite-svelte"
import { PlusOutline, TrashBinOutline, CheckOutline, CloseOutline } from "flowbite-svelte-icons"
import { moods } from './storage'
import type { Mood } from './storage'

interface Props {
  onBack: () => void
}

let { onBack }: Props = $props()

let editingId: string | null = $state(null)
let newMood = $state({ text: '', tag: '' })
let editMood = $state({ text: '', tag: '' })

function startAdd() {
  editingId = 'new'
  newMood = { text: '', tag: '' }
}

function cancelAdd() {
  editingId = null
  newMood = { text: '', tag: '' }
}

function addMood() {
  if (!newMood.text.trim() || !newMood.tag.trim()) return

  moods.update(items => {
    const newId = Date.now().toString()
    return [...items, { id: newId, text: newMood.text, tag: newMood.tag }]
  })

  cancelAdd()
}

function startEdit(mood: Mood) {
  editingId = mood.id
  editMood = { text: mood.text, tag: mood.tag }
}

function cancelEdit() {
  editingId = null
  editMood = { text: '', tag: '' }
}

function saveEdit(id: string) {
  if (!editMood.text.trim() || !editMood.tag.trim()) return

  moods.update(items =>
    items.map(item =>
      item.id === id
        ? { ...item, text: editMood.text, tag: editMood.tag }
        : item
    )
  )

  cancelEdit()
}

function deleteMood(id: string) {
  if (confirm('Are you sure you want to delete this mood?')) {
    moods.update(items => items.filter(item => item.id !== id))
  }
}
</script>

<div class="flex flex-col gap-4 p-4 h-screen pb-24">
  <div class="flex items-center justify-between mb-4">
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={onBack}>← Back</Button>
    <h2 class="text-2xl font-bold">Manage Moods</h2>
    <Button onclick={startAdd}  class="text-sm text-gray-600 dark:text-gray-400" disabled={editingId !== null}>
      <PlusOutline class="w-5 h-5 mr-2" />
      Add
    </Button>
  </div>

  {#if editingId === 'new'}
  <Card class="bg-green-50 dark:bg-green-900">
    <div class="flex flex-col gap-3">
      <div>
        <Label>Display Text (emoji recommended)</Label>
        <Input bind:value={newMood.text} placeholder="🙂" />
      </div>
      <div>
        <Label>Tag (unique identifier)</Label>
        <Input bind:value={newMood.tag} placeholder="good" />
      </div>
      <div class="flex gap-2 text-grey">
        <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={addMood}>
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
    {#each $moods as mood (mood.id)}
      <Card>
        {#if editingId === mood.id}
          <div class="flex flex-col gap-3">
            <div>
              <Label>Display Text</Label>
              <Input bind:value={editMood.text} />
            </div>
            <div>
              <Label>Tag</Label>
              <Input bind:value={editMood.tag} />
            </div>
            <div class="flex gap-2 text-grey">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => saveEdit(mood.id)}>
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
              <div class="text-2xl mb-1">{mood.text}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Tag: {mood.tag}</div>
            </div>
            <div class="flex gap-2">
              <Button class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => startEdit(mood)} disabled={editingId !== null}>
                Edit
              </Button>
              <Button class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => deleteMood(mood.id)} disabled={editingId !== null}>
                <TrashBinOutline class="w-4 h-4" />
              </Button>
            </div>
          </div>
        {/if}
      </Card>
    {/each}
  </div>
</div>

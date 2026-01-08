<script lang="ts">
import { Card, Button, Input, Label, Checkbox } from "flowbite-svelte"
import { PlusOutline, TrashBinOutline, CheckOutline, CloseOutline } from "flowbite-svelte-icons"
import { actions, groups, moods } from './storage'
import type { Action } from './storage'

interface Props {
  onBack: () => void
}

let { onBack }: Props = $props()

let editingId: string | null = $state(null)
let newAction = $state({ text: '', tags: [] as string[] })
let editAction = $state({ text: '', tags: [] as string[] })

// Get all available tags from groups and moods
let availableTags = $derived([
  ...$groups.map(g => ({ value: g.tag, label: `Group: ${g.name}`, category: 'group' })),
  ...$moods.map(m => ({ value: m.tag, label: `Mood: ${m.text}`, category: 'mood' }))
])

function startAdd() {
  editingId = 'new'
  newAction = { text: '', tags: [] }
}

function cancelAdd() {
  editingId = null
  newAction = { text: '', tags: [] }
}

function addAction() {
  if (!newAction.text.trim() || newAction.tags.length === 0) return

  actions.update(items => {
    const newId = Date.now().toString()
    return [...items, { id: newId, text: newAction.text, tags: [...newAction.tags] }]
  })

  cancelAdd()
}

function startEdit(action: Action) {
  editingId = action.id
  editAction = { text: action.text, tags: [...action.tags] }
}

function cancelEdit() {
  editingId = null
  editAction = { text: '', tags: [] }
}

function saveEdit(id: string) {
  if (!editAction.text.trim() || editAction.tags.length === 0) return

  actions.update(items =>
    items.map(item =>
      item.id === id
        ? { ...item, text: editAction.text, tags: [...editAction.tags] }
        : item
    )
  )

  cancelEdit()
}

function deleteAction(id: string) {
  if (confirm('Are you sure you want to delete this action?')) {
    actions.update(items => items.filter(item => item.id !== id))
  }
}

function toggleTag(tags: string[], tag: string) {
  const index = tags.indexOf(tag)
  if (index > -1) {
    tags.splice(index, 1)
  } else {
    tags.push(tag)
  }
  return tags
}

function getTagLabel(tag: string) {
  const group = $groups.find(g => g.tag === tag)
  if (group) return group.name

  const mood = $moods.find(m => m.tag === tag)
  if (mood) return mood.text

  return tag
}
</script>

<div class="flex flex-col gap-4 p-4 h-screen pb-24">
  <div class="flex items-center justify-between mb-4">
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={onBack}>← Back</Button>
    <h2 class="text-2xl font-bold">Manage Actions</h2>
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={startAdd} disabled={editingId !== null}>
      <PlusOutline class="w-5 h-5 mr-2" />
      Add
    </Button>
  </div>

  {#if editingId === 'new'}
  <Card class="bg-green-50 dark:bg-green-900">
    <div class="flex flex-col gap-3">
      <div>
        <Label>Action Text</Label>
        <Input bind:value={newAction.text} placeholder="great" />
      </div>
      <div>
        <Label class="mb-2">Tags (select all that apply)</Label>
        <div class="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded dark:border-gray-600">
          {#each availableTags as tag}
            <Checkbox
              checked={newAction.tags.includes(tag.value)}
              on:change={() => newAction.tags = toggleTag(newAction.tags, tag.value)}
            >
              {tag.label}
            </Checkbox>
          {/each}
        </div>
      </div>
      <div class="flex gap-2">
        <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={addAction}>
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
    {#each $actions as action (action.id)}
      <Card>
        {#if editingId === action.id}
          <div class="flex flex-col gap-3">
            <div>
              <Label>Action Text</Label>
              <Input bind:value={editAction.text} />
            </div>
            <div>
              <Label class="mb-2">Tags</Label>
              <div class="flex flex-col gap-2 max-h-48 overflow-y-auto p-2 border rounded dark:border-gray-600">
                {#each availableTags as tag}
                  <Checkbox
                    checked={editAction.tags.includes(tag.value)}
                    on:change={() => editAction.tags = toggleTag(editAction.tags, tag.value)}
                  >
                    {tag.label}
                  </Checkbox>
                {/each}
              </div>
            </div>
            <div class="flex gap-2">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => saveEdit(action.id)}>
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
              <div class="text-lg font-semibold mb-2">{action.text}</div>
              <div class="flex flex-wrap gap-2">
                {#each action.tags as tag}
                  <span class="px-2 py-1 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                    {getTagLabel(tag)}
                  </span>
                {/each}
              </div>
            </div>
            <div class="flex gap-2">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => startEdit(action)} disabled={editingId !== null}>
                Edit
              </Button>
              <Button  class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => deleteAction(action.id)} disabled={editingId !== null}>
                <TrashBinOutline class="w-4 h-4" />
              </Button>
            </div>
          </div>
        {/if}
      </Card>
    {/each}
  </div>
</div>

<script lang="ts">
import { Card, Button, Input, Label } from "flowbite-svelte"
import { PlusOutline, TrashBinOutline, CheckOutline, CloseOutline } from "flowbite-svelte-icons"
import { groups, actors } from './storage'
import type { Group } from './storage'

interface Props {
  onBack: () => void
}

let { onBack }: Props = $props()

let editingId: string | null = $state(null)
let newGroup = $state({ name: '', tag: '' })
let editGroup = $state({ name: '', tag: '' })

function startAdd() {
  editingId = 'new'
  newGroup = { name: '', tag: '' }
}

function cancelAdd() {
  editingId = null
  newGroup = { name: '', tag: '' }
}

function addGroup() {
  if (!newGroup.name.trim() || !newGroup.tag.trim()) return

  groups.update(items => {
    const newId = Date.now().toString()
    return [...items, { id: newId, name: newGroup.name, tag: newGroup.tag }]
  })

  cancelAdd()
}

function startEdit(group: Group) {
  editingId = group.id
  editGroup = { name: group.name, tag: group.tag }
}

function cancelEdit() {
  editingId = null
  editGroup = { name: '', tag: '' }
}

function saveEdit(id: string) {
  if (!editGroup.name.trim() || !editGroup.tag.trim()) return

  groups.update(items =>
    items.map(item =>
      item.id === id
        ? { ...item, name: editGroup.name, tag: editGroup.tag }
        : item
    )
  )

  cancelEdit()
}

function deleteGroup(id: string) {
  const group = $groups.find(g => g.id === id)
  if (!group) return

  const actorsInGroup = $actors.filter(a => a.tag === group.tag)
  if (actorsInGroup.length > 0) {
    alert(`Cannot delete this group. It has ${actorsInGroup.length} actor(s) assigned to it. Please reassign or delete those actors first.`)
    return
  }

  if (confirm('Are you sure you want to delete this group?')) {
    groups.update(items => items.filter(item => item.id !== id))
  }
}

function getActorCount(tag: string) {
  return $actors.filter(a => a.tag === tag).length
}
</script>

<div class="flex flex-col gap-4 p-4 h-screen pb-24">
  <div class="flex items-center justify-between mb-4">
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={onBack}>← Back</Button>
    <h2 class="text-2xl font-bold">Manage Groups</h2>
    <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={startAdd} disabled={editingId !== null}>
      <PlusOutline class="w-5 h-5 mr-2" />
      Add
    </Button>
  </div>

  {#if editingId === 'new'}
  <Card class="bg-green-50 dark:bg-green-900">
    <div class="flex flex-col gap-3">
      <div>
        <Label>Group Name</Label>
        <Input bind:value={newGroup.name} placeholder="Self" />
      </div>
      <div>
        <Label>Tag (unique identifier)</Label>
        <Input bind:value={newGroup.tag} placeholder="felt" />
      </div>
      <div class="flex gap-2">
        <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={addGroup}>
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
    {#each $groups as group (group.id)}
      <Card>
        {#if editingId === group.id}
          <div class="flex flex-col gap-3">
            <div>
              <Label>Group Name</Label>
              <Input bind:value={editGroup.name} />
            </div>
            <div>
              <Label>Tag</Label>
              <Input bind:value={editGroup.tag} />
            </div>
            <div class="flex gap-2">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" onclick={() => saveEdit(group.id)}>
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
              <div class="text-lg font-semibold mb-1">{group.name}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                Tag: {group.tag} • {getActorCount(group.tag)} actor(s)
              </div>
            </div>
            <div class="flex gap-2">
              <Button  class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => startEdit(group)} disabled={editingId !== null}>
                Edit
              </Button>
              <Button  class="text-sm text-gray-600 dark:text-gray-400" size="sm" onclick={() => deleteGroup(group.id)} disabled={editingId !== null}>
                <TrashBinOutline class="w-4 h-4" />
              </Button>
            </div>
          </div>
        {/if}
      </Card>
    {/each}
  </div>
</div>

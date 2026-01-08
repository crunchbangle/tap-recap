
import { persisted } from 'svelte-persisted-store'

export interface Tap {
    datetime: string
    mood: string
    actor: string
    event: string
}

export interface Mood {
    id: string
    text: string
    tag: string
}

export interface Actor {
    id: string
    text: string
    tag: string
}

export interface Group {
    id: string
    name: string
    tag: string
}

export interface Action {
    id: string
    text: string
    tags: string[]  // Array of tags that this action applies to (actor tags, group tags, mood tags)
}

export const taps = persisted<Tap[]>('taplog', [])

export const moods = persisted<Mood[]>('moods', [
    { id: '1', text: '🙂', tag: 'good' },
    { id: '2', text: '😐', tag: 'meh' },
    { id: '3', text: '🙁', tag: 'bad' }
])

export const actors = persisted<Actor[]>('actors', [
    { id: '1', text: 'I felt', tag: 'felt' },
    { id: '2', text: 'I did', tag: 'did' },
    { id: '3', text: 'A friend', tag: 'others' },
    { id: '4', text: 'Family', tag: 'others' },
    { id: '5', text: 'A stranger', tag: 'others' },
    { id: '6', text: 'A peer/colleague', tag: 'others' }
])

export const groups = persisted<Group[]>('groups', [
    { id: '1', name: 'Self', tag: 'felt' },
    { id: '2', name: 'Actions', tag: 'did' },
    { id: '3', name: 'Others', tag: 'others' }
])

export const actions = persisted<Action[]>('actions', [
    { id: '1', text: 'great', tags: ['felt', 'did', 'good'] }
])

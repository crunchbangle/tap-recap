
import { persisted } from 'svelte-persisted-store'

export interface Tap {
    datetime: string
    mood: string
    actor: string
    event: string
}

export const taps = persisted<Tap[]>('taplog', [])

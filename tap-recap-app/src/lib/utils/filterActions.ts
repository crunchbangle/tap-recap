import type { Action } from '../types';

export function filterActions(
	actions: Action[],
	selectedMoodTag?: string,
	selectedActorTag?: string
): Action[] {
	if (!selectedMoodTag && !selectedActorTag) {
		return [];
	}

	return actions.filter((action) => {
		const hasAllRequiredTags =
			(!selectedMoodTag || action.tags.includes(selectedMoodTag)) &&
			(!selectedActorTag || action.tags.includes(selectedActorTag));
		return hasAllRequiredTags;
	});
}

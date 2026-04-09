import type { AppConfig, UserPreferences } from '../types';

export const defaultConfig: Omit<AppConfig, 'version' | 'timestamp'> = {
	moods: [
		{ tag: 'good', displayText: '☺️', color: '#22c55e' }, // green-500
		{ tag: 'meh', displayText: '😐', color: '#6b7280' }, // gray-500
		{ tag: 'bad', displayText: '😞', color: '#ef4444' } // red-500
	],
	actors: [
		// "me" tag actors
		{ tag: 'me', displayText: 'I' },
		// "felt" tag actors
		{ tag: 'felt', displayText: 'I felt' },
		// "other" tag actors
		{ tag: 'other', displayText: 'A family member' },
		{ tag: 'other', displayText: 'Friend' },
		{ tag: 'other', displayText: 'A colleague' },
		{ tag: 'other', displayText: 'An acquintance' },
		{ tag: 'other', displayText: 'A stranger' },
		{ tag: 'mademe', displayText: 'Some media' },
		{ tag: 'mademe', displayText: 'A memory' }
	],
	actions: [
		// Actions with "felt" and "good" tags
		{ tags: ['felt', 'good'], displayText: 'Great' },
		{ tags: ['felt', 'good'], displayText: 'Confident' },
		{ tags: ['felt', 'good'], displayText: 'Joy' },
		{ tags: ['felt', 'good'], displayText: 'Surprise' },
		{ tags: ['felt', 'good'], displayText: 'Anticipation' },
		{ tags: ['felt', 'good'], displayText: 'Trust' },
		{ tags: ['felt', 'good'], displayText: 'Relief' },
		{ tags: ['felt', 'good'], displayText: 'Amused' },
		{ tags: ['felt', 'good'], displayText: 'Desire' },
		{ tags: ['felt', 'good'], displayText: 'Awe' },
		{ tags: ['felt', 'good'], displayText: 'Justified' },

		// Actions with "felt" and "bad" tags
		{ tags: ['felt', 'bad'], displayText: 'Fear' },
		{ tags: ['felt', 'bad'], displayText: 'Anger' },
		{ tags: ['felt', 'bad'], displayText: 'Sad' },
		{ tags: ['felt', 'bad'], displayText: 'Disgust' },
		{ tags: ['felt', 'bad'], displayText: 'Anticipation' },
		{ tags: ['felt', 'bad'], displayText: 'Surprise' },
		{ tags: ['felt', 'bad'], displayText: 'Shame' },
		{ tags: ['felt', 'bad'], displayText: 'Confused' },
		{ tags: ['felt', 'bad'], displayText: 'Horror' },
		{ tags: ['felt', 'bad'], displayText: 'Desire' },

		// Actions with "felt" and "meh" tags
		{ tags: ['felt', 'meh'], displayText: 'Flat' },
		{ tags: ['felt', 'meh'], displayText: 'Distracted' },
		{ tags: ['felt', 'meh'], displayText: 'Detached' },
		{ tags: ['felt', 'meh'], displayText: 'Calm' },
		{ tags: ['felt', 'meh'], displayText: 'Relief' },
		{ tags: ['felt', 'meh'], displayText: 'Bored' },

		// Actions with "me" and "good" tags
		{ tags: ['me', 'good'], displayText: 'Appreciated someone' },
		{ tags: ['me', 'good'], displayText: 'Complimented someone' },
		{ tags: ['me', 'good'], displayText: 'Did something fun' },
		{ tags: ['me', 'good'], displayText: 'Made someone laugh' },
		{ tags: ['me', 'good'], displayText: 'Made someone smile' },
		{ tags: ['me', 'good'], displayText: 'Had a great experience' },

		// Actions with "me" and "bad" tags
		{ tags: ['me', 'bad'], displayText: 'Made someone cry' },
		{ tags: ['me', 'bad'], displayText: 'Slipped up' },
		{ tags: ['me', 'bad'], displayText: 'Forgot something' },

		// Actions with "me" and "meh" tags
		{ tags: ['me', 'meh'], displayText: 'Did what I needed to' },

		// Actions with "other" and "good" tags
		{ tags: ['other', 'good'], displayText: 'Complimented me' },
		{ tags: ['other', 'mademe', 'good'], displayText: 'Made me smile' },
		{ tags: ['other', 'good'], displayText: 'Affirmed me' },

		// Actions with "other" and "bad" tags
		{ tags: ['other', 'mademe', 'bad'], displayText: 'Made me furious' },
		{ tags: ['other', 'mademe', 'bad'], displayText: 'Made me cry' },
		{ tags: ['other', 'bad'], displayText: 'Laughed at me' },
		{ tags: ['other', 'bad'], displayText: 'Ignored me' },

		// Actions with "me" and "other" and "good" tags
		{ tags: ['me', 'other', 'good'], displayText: 'Did a good deed' },
		{ tags: ['me', 'other', 'good'], displayText: 'Made a caring gesture' },

		// Actions with "me" and "other" and "bad" tags
		{ tags: ['me', 'other', 'bad'], displayText: 'Did something terrible' },
		{ tags: ['me', 'other', 'bad'], displayText: 'Said something terrible' },

		// Actions with "other" and "good" and "bad" and "meh" tags (universal)
		{ tags: ['other', 'good', 'bad', 'meh'], displayText: 'phoned' },
		{ tags: ['other', 'good', 'bad', 'meh'], displayText: 'spoke to me' },
		{ tags: ['other', 'good', 'bad', 'meh'], displayText: 'came round' }
	]
};

export const defaultPreferences: UserPreferences = {
	configVersionsToKeep: 5,
	sortOrder: 'config',
	reverseOrder: false,
	defaultChartDuration: 14
};

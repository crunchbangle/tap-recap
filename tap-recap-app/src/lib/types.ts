// Core data types for Tap-Recap

export interface Mood {
	tag: string;
	displayText: string;
	color: string; // hex color for charts, e.g. "#22c55e"
}

export interface Actor {
	tag: string;
	displayText: string;
}

export interface Action {
	tags: string[];
	displayText: string;
}

export interface Emote {
	id: string;
	timestamp: Date;
	mood: string;
	actor: string;
	action: string;
	reviewed: boolean;
	flags?: {
		mistake?: boolean;
		earlierTime?: boolean;
		contextNotRight?: boolean;
	};
}

export interface AppConfig {
	version: number;
	timestamp: Date;
	moods: Mood[];
	actors: Actor[];
	actions: Action[];
}

export interface UserPreferences {
	configVersionsToKeep: number;
	sortOrder: 'config' | 'alphabetic' | 'lastUsed';
	reverseOrder: boolean;
	defaultChartDuration: number; // days
}

export interface ExportData {
	configs: AppConfig[];
	emotes: Emote[];
	preferences: UserPreferences;
	exportDate: Date;
}

export type ExportFormat = 'json' | 'yaml' | 'xml';

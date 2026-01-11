import type { Emote, AppConfig, UserPreferences, ExportData, ExportFormat } from '../types';

export interface IDataService {
	// Emote operations
	logEmote(emote: Omit<Emote, 'id'>): Promise<string>;
	getEmotes(startDate?: Date, endDate?: Date): Promise<Emote[]>;
	getUnreviewedEmotes(): Promise<Emote[]>;
	updateEmote(id: string, updates: Partial<Emote>): Promise<void>;
	markEmoteReviewed(id: string, reviewed: boolean): Promise<void>;
	markAllEmotesReviewed(emoteIds: string[]): Promise<void>;

	// Config operations
	getCurrentConfig(): Promise<AppConfig>;
	getConfigHistory(): Promise<AppConfig[]>;
	saveConfig(config: Omit<AppConfig, 'version' | 'timestamp'>): Promise<void>;
	deleteConfigVersion(version: number): Promise<void>;

	// Preferences operations
	getPreferences(): Promise<UserPreferences>;
	savePreferences(preferences: UserPreferences): Promise<void>;

	// Export/Import operations
	exportData(
		format: ExportFormat,
		includeAllConfigs?: boolean,
		configVersion?: number
	): Promise<string>;
	importData(data: string, format: ExportFormat): Promise<void>;

	// Utility operations
	clearAllData(): Promise<void>;
	getStorageSize(): Promise<number>;
}

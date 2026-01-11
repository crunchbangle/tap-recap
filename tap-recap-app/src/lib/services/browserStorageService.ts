import type {
	Emote,
	AppConfig,
	UserPreferences,
	ExportData,
	ExportFormat
} from '../types';
import type { IDataService } from './dataService.interface';
import { defaultConfig, defaultPreferences } from '../config/defaultConfig';
import yaml from 'js-yaml';

const STORAGE_KEYS = {
	EMOTES: 'tap-recap-emotes',
	CONFIGS: 'tap-recap-configs',
	PREFERENCES: 'tap-recap-preferences'
};

export class BrowserStorageService implements IDataService {
	private generateId(): string {
		return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
	}

	private serializeDate(obj: any): any {
		if (obj instanceof Date) {
			return obj.toISOString();
		}
		if (Array.isArray(obj)) {
			return obj.map((item) => this.serializeDate(item));
		}
		if (obj && typeof obj === 'object') {
			const serialized: any = {};
			for (const key in obj) {
				serialized[key] = this.serializeDate(obj[key]);
			}
			return serialized;
		}
		return obj;
	}

	private deserializeDate(obj: any): any {
		if (typeof obj === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(obj)) {
			return new Date(obj);
		}
		if (Array.isArray(obj)) {
			return obj.map((item) => this.deserializeDate(item));
		}
		if (obj && typeof obj === 'object') {
			const deserialized: any = {};
			for (const key in obj) {
				deserialized[key] = this.deserializeDate(obj[key]);
			}
			return deserialized;
		}
		return obj;
	}

	async logEmote(emote: Omit<Emote, 'id'>): Promise<string> {
		const emotes = await this.getEmotes();
		const newEmote: Emote = {
			...emote,
			id: this.generateId()
		};
		emotes.push(newEmote);
		localStorage.setItem(STORAGE_KEYS.EMOTES, JSON.stringify(this.serializeDate(emotes)));
		return newEmote.id;
	}

	async getEmotes(startDate?: Date, endDate?: Date): Promise<Emote[]> {
		const stored = localStorage.getItem(STORAGE_KEYS.EMOTES);
		let emotes: Emote[] = stored ? this.deserializeDate(JSON.parse(stored)) : [];

		if (startDate || endDate) {
			emotes = emotes.filter((emote) => {
				const emoteDate = new Date(emote.timestamp);
				if (startDate && emoteDate < startDate) return false;
				if (endDate && emoteDate > endDate) return false;
				return true;
			});
		}

		return emotes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
	}

	async getUnreviewedEmotes(): Promise<Emote[]> {
		const emotes = await this.getEmotes();
		return emotes.filter((emote) => !emote.reviewed);
	}

	async updateEmote(id: string, updates: Partial<Emote>): Promise<void> {
		const emotes = await this.getEmotes();
		const index = emotes.findIndex((e) => e.id === id);
		if (index !== -1) {
			emotes[index] = { ...emotes[index], ...updates };
			localStorage.setItem(STORAGE_KEYS.EMOTES, JSON.stringify(this.serializeDate(emotes)));
		}
	}

	async markEmoteReviewed(id: string, reviewed: boolean): Promise<void> {
		await this.updateEmote(id, { reviewed });
	}

	async markAllEmotesReviewed(emoteIds: string[]): Promise<void> {
		const emotes = await this.getEmotes();
		emotes.forEach((emote) => {
			if (emoteIds.includes(emote.id)) {
				emote.reviewed = true;
			}
		});
		localStorage.setItem(STORAGE_KEYS.EMOTES, JSON.stringify(this.serializeDate(emotes)));
	}

	async getCurrentConfig(): Promise<AppConfig> {
		const configs = await this.getConfigHistory();
		if (configs.length === 0) {
			// Initialize with default config
			await this.saveConfig(defaultConfig);
			return this.getCurrentConfig();
		}
		return configs[configs.length - 1];
	}

	async getConfigHistory(): Promise<AppConfig[]> {
		const stored = localStorage.getItem(STORAGE_KEYS.CONFIGS);
		return stored ? this.deserializeDate(JSON.parse(stored)) : [];
	}

	async saveConfig(config: Omit<AppConfig, 'version' | 'timestamp'>): Promise<void> {
		const configs = await this.getConfigHistory();
		const preferences = await this.getPreferences();

		const newConfig: AppConfig = {
			...config,
			version: configs.length + 1,
			timestamp: new Date()
		};

		configs.push(newConfig);

		// Trim old configs based on preferences
		if (configs.length > preferences.configVersionsToKeep) {
			configs.splice(0, configs.length - preferences.configVersionsToKeep);
		}

		localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(this.serializeDate(configs)));
	}

	async deleteConfigVersion(version: number): Promise<void> {
		const configs = await this.getConfigHistory();
		const filtered = configs.filter((c) => c.version !== version);
		localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(this.serializeDate(filtered)));
	}

	async getPreferences(): Promise<UserPreferences> {
		const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
		return stored ? JSON.parse(stored) : defaultPreferences;
	}

	async savePreferences(preferences: UserPreferences): Promise<void> {
		localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences));
	}

	async exportData(
		format: ExportFormat,
		includeAllConfigs = false,
		configVersion?: number
	): Promise<string> {
		const emotes = await this.getEmotes();
		const configs = await this.getConfigHistory();
		const preferences = await this.getPreferences();

		let configsToExport: AppConfig[];
		if (configVersion !== undefined) {
			const config = configs.find((c) => c.version === configVersion);
			configsToExport = config ? [config] : [];
		} else if (includeAllConfigs) {
			configsToExport = configs;
		} else {
			const currentConfig = await this.getCurrentConfig();
			configsToExport = [currentConfig];
		}

		const exportData: ExportData = {
			configs: configsToExport,
			emotes,
			preferences,
			exportDate: new Date()
		};

		switch (format) {
			case 'json':
				return JSON.stringify(this.serializeDate(exportData), null, 2);
			case 'yaml':
				return yaml.dump(this.serializeDate(exportData));
			case 'xml':
				return this.toXML(this.serializeDate(exportData));
			default:
				throw new Error(`Unsupported export format: ${format}`);
		}
	}

	async importData(data: string, format: ExportFormat): Promise<void> {
		let importData: ExportData;

		switch (format) {
			case 'json':
				importData = this.deserializeDate(JSON.parse(data));
				break;
			case 'yaml':
				importData = this.deserializeDate(yaml.load(data) as ExportData);
				break;
			case 'xml':
				throw new Error('XML import not yet implemented');
			default:
				throw new Error(`Unsupported import format: ${format}`);
		}

		// Import emotes
		const existingEmotes = await this.getEmotes();
		const newEmotes = [...existingEmotes, ...importData.emotes];
		localStorage.setItem(STORAGE_KEYS.EMOTES, JSON.stringify(this.serializeDate(newEmotes)));

		// Import configs
		const existingConfigs = await this.getConfigHistory();
		const allConfigs = [...existingConfigs, ...importData.configs];
		const preferences = await this.getPreferences();

		// Trim to keep only the configured number of versions
		if (allConfigs.length > preferences.configVersionsToKeep) {
			allConfigs.splice(0, allConfigs.length - preferences.configVersionsToKeep);
		}

		localStorage.setItem(STORAGE_KEYS.CONFIGS, JSON.stringify(this.serializeDate(allConfigs)));

		// Import preferences (optionally)
		if (importData.preferences) {
			await this.savePreferences(importData.preferences);
		}
	}

	async clearAllData(): Promise<void> {
		localStorage.removeItem(STORAGE_KEYS.EMOTES);
		localStorage.removeItem(STORAGE_KEYS.CONFIGS);
		localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
	}

	async getStorageSize(): Promise<number> {
		let total = 0;
		for (const key of Object.values(STORAGE_KEYS)) {
			const item = localStorage.getItem(key);
			if (item) {
				total += item.length;
			}
		}
		return total;
	}

	private toXML(obj: any, rootName = 'exportData'): string {
		const escapeXML = (str: string): string => {
			return String(str)
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;')
				.replace(/'/g, '&apos;');
		};

		const objectToXML = (obj: any, name: string, indent = ''): string => {
			if (obj === null || obj === undefined) {
				return `${indent}<${name} />`;
			}

			if (Array.isArray(obj)) {
				return obj.map((item) => objectToXML(item, name, indent)).join('\n');
			}

			if (typeof obj === 'object') {
				const props = Object.keys(obj)
					.map((key) => objectToXML(obj[key], key, indent + '  '))
					.join('\n');
				return `${indent}<${name}>\n${props}\n${indent}</${name}>`;
			}

			return `${indent}<${name}>${escapeXML(obj)}</${name}>`;
		};

		return `<?xml version="1.0" encoding="UTF-8"?>\n${objectToXML(obj, rootName)}`;
	}
}

// Export a singleton instance
export const dataService = new BrowserStorageService();

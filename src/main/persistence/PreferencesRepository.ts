import { app } from 'electron';
import fs from 'fs';
import path from 'path';
import { UserPreferences } from '../../shared/models/types';

export class PreferencesRepository {
  private storageDir: string;
  private preferencesFile: string;
  private preferences: UserPreferences;

  constructor() {
    this.storageDir = path.join(app.getPath('userData'), 'storage');
    this.preferencesFile = path.join(this.storageDir, 'preferences.json');
    
    // Default preferences
    this.preferences = {
      theme: 'light',
      fontSize: 14,
      autoSave: true,
    };
    
    this.initStorage();
    this.loadPreferences();
  }

  private initStorage(): void {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.preferencesFile)) {
      this.savePreferences();
    }
  }

  private loadPreferences(): void {
    try {
      const data = fs.readFileSync(this.preferencesFile, 'utf-8');
      const loadedPreferences: UserPreferences = JSON.parse(data);
      
      this.preferences = {
        ...this.preferences, // Keep defaults for any missing properties
        ...loadedPreferences,
      };
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  private savePreferences(): void {
    try {
      fs.writeFileSync(this.preferencesFile, JSON.stringify(this.preferences, null, 2));
    } catch (error) {
      console.error('Failed to save preferences:', error);
    }
  }

  async getPreferences(): Promise<UserPreferences> {
    return { ...this.preferences };
  }

  async updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences> {
    this.preferences = {
      ...this.preferences,
      ...updates,
    };
    
    this.savePreferences();
    
    return { ...this.preferences };
  }
} 
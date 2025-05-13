const { app } = require('electron');
const fs = require('fs');
const path = require('path');

class PreferencesRepository {
  constructor() {
    this.storageDir = path.join(app.getPath('userData'), 'storage');
    this.preferencesFile = path.join(this.storageDir, 'preferences.json');
    this.initStorage();
  }

  initStorage() {
    if (!fs.existsSync(this.storageDir)) {
      fs.mkdirSync(this.storageDir, { recursive: true });
    }
    
    if (!fs.existsSync(this.preferencesFile)) {
      // Default preferences
      const defaultPreferences = {
        theme: 'light',
        fontSize: 14,
        fontFamily: 'Arial',
        autoSave: true,
        sortOrder: 'updated',
        showDeleted: false,
      };
      
      fs.writeFileSync(
        this.preferencesFile, 
        JSON.stringify(defaultPreferences, null, 2)
      );
    }
  }

  async getPreferences() {
    try {
      const data = fs.readFileSync(this.preferencesFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Failed to load preferences:', error);
      return {};
    }
  }

  async updatePreferences(preferences) {
    try {
      const currentPreferences = await this.getPreferences();
      const updatedPreferences = { ...currentPreferences, ...preferences };
      
      fs.writeFileSync(
        this.preferencesFile, 
        JSON.stringify(updatedPreferences, null, 2)
      );
      
      return updatedPreferences;
    } catch (error) {
      console.error('Failed to update preferences:', error);
      throw error;
    }
  }
}

module.exports = { PreferencesRepository }; 
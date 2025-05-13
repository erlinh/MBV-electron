"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreferencesRepository = void 0;
const electron_1 = require("electron");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class PreferencesRepository {
    constructor() {
        this.storageDir = path_1.default.join(electron_1.app.getPath('userData'), 'storage');
        this.preferencesFile = path_1.default.join(this.storageDir, 'preferences.json');
        // Default preferences
        this.preferences = {
            theme: 'light',
            fontSize: 14,
            autoSave: true,
        };
        this.initStorage();
        this.loadPreferences();
    }
    initStorage() {
        if (!fs_1.default.existsSync(this.storageDir)) {
            fs_1.default.mkdirSync(this.storageDir, { recursive: true });
        }
        if (!fs_1.default.existsSync(this.preferencesFile)) {
            this.savePreferences();
        }
    }
    loadPreferences() {
        try {
            const data = fs_1.default.readFileSync(this.preferencesFile, 'utf-8');
            const loadedPreferences = JSON.parse(data);
            this.preferences = {
                ...this.preferences, // Keep defaults for any missing properties
                ...loadedPreferences,
            };
        }
        catch (error) {
            console.error('Failed to load preferences:', error);
        }
    }
    savePreferences() {
        try {
            fs_1.default.writeFileSync(this.preferencesFile, JSON.stringify(this.preferences, null, 2));
        }
        catch (error) {
            console.error('Failed to save preferences:', error);
        }
    }
    async getPreferences() {
        return { ...this.preferences };
    }
    async updatePreferences(updates) {
        this.preferences = {
            ...this.preferences,
            ...updates,
        };
        this.savePreferences();
        return { ...this.preferences };
    }
}
exports.PreferencesRepository = PreferencesRepository;

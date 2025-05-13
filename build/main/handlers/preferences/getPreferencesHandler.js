"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPreferencesHandler = getPreferencesHandler;
function getPreferencesHandler(repository) {
    return async (query) => {
        try {
            const preferences = await repository.getPreferences();
            return {
                preferences,
            };
        }
        catch (error) {
            console.error('Error getting preferences:', error);
            return {
                preferences: {
                    theme: 'light',
                    fontSize: 14,
                    autoSave: true,
                },
            };
        }
    };
}

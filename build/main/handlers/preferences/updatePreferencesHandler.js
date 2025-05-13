"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePreferencesHandler = updatePreferencesHandler;
function updatePreferencesHandler(repository) {
    return async (command) => {
        try {
            const { theme, fontSize, autoSave } = command.payload;
            await repository.updatePreferences({
                theme,
                fontSize,
                autoSave,
            });
            return {
                success: true,
            };
        }
        catch (error) {
            console.error('Error updating preferences:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    };
}

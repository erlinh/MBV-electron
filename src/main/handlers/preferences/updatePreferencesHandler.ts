import { UpdatePreferencesCommand, UpdatePreferencesResult } from '../../../shared/commands/preferenceCommands';
import { PreferencesRepository } from '../../persistence/PreferencesRepository';

export function updatePreferencesHandler(repository: PreferencesRepository) {
  return async (command: UpdatePreferencesCommand): Promise<UpdatePreferencesResult> => {
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
    } catch (error) {
      console.error('Error updating preferences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}
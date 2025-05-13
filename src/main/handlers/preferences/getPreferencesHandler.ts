import { GetPreferencesQuery, GetPreferencesResult } from '../../../shared/queries/preferenceQueries';
import { PreferencesRepository } from '../../persistence/PreferencesRepository';

export function getPreferencesHandler(repository: PreferencesRepository) {
  return async (query: GetPreferencesQuery): Promise<GetPreferencesResult> => {
    try {
      const preferences = await repository.getPreferences();
      
      return {
        preferences,
      };
    } catch (error) {
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
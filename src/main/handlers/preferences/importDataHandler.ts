import { ImportDataCommand, ImportDataResult } from '../../../shared/commands/preferenceCommands';
import { NoteRepository } from '../../persistence/NoteRepository';

export function importDataHandler(repository: NoteRepository) {
  return async (command: ImportDataCommand): Promise<ImportDataResult> => {
    try {
      const { data } = command.payload;
      
      const count = await repository.importNotes(data);
      
      return {
        success: true,
        count,
      };
    } catch (error) {
      console.error('Error importing data:', error);
      return {
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
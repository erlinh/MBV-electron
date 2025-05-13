import { ExportDataCommand, ExportDataResult } from '../../../shared/commands/preferenceCommands';
import { NoteRepository } from '../../persistence/NoteRepository';

export function exportDataHandler(repository: NoteRepository) {
  return async (command: ExportDataCommand): Promise<ExportDataResult> => {
    try {
      const { format } = command.payload;
      
      const data = await repository.exportNotes(format);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
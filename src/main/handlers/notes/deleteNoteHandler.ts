import { DeleteNoteCommand, DeleteNoteResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';

export function deleteNoteHandler(repository: NoteRepository) {
  return async (command: DeleteNoteCommand): Promise<DeleteNoteResult> => {
    try {
      const { id } = command.payload;
      
      const deleted = await repository.deleteNote(id);
      
      if (!deleted) {
        return {
          success: false,
          error: `Note with id ${id} not found`,
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error deleting note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
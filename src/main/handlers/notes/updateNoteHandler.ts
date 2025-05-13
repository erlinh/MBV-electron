import { UpdateNoteCommand, UpdateNoteResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';

export function updateNoteHandler(repository: NoteRepository) {
  return async (command: UpdateNoteCommand): Promise<UpdateNoteResult> => {
    try {
      const { id, title, content, tags } = command.payload;
      
      const updatedNote = await repository.updateNote(id, {
        title,
        content,
        tags,
      });
      
      if (!updatedNote) {
        return {
          success: false,
          error: `Note with id ${id} not found`,
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error updating note:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
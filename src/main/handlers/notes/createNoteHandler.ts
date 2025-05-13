import { CreateNoteCommand, CreateNoteResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';

export function createNoteHandler(repository: NoteRepository) {
  return async (command: CreateNoteCommand): Promise<CreateNoteResult> => {
    try {
      const { title, content, tags = [] } = command.payload;
      
      const newNote = await repository.createNote({
        title,
        content,
        tags,
      });
      
      return {
        success: true,
        noteId: newNote.id,
      };
    } catch (error) {
      console.error('Error creating note:', error);
      return {
        success: false,
        noteId: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
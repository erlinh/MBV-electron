import { AddTagCommand, AddTagResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';

export function addTagHandler(repository: NoteRepository) {
  return async (command: AddTagCommand): Promise<AddTagResult> => {
    try {
      const { noteId, tag } = command.payload;
      
      const note = await repository.getNoteById(noteId);
      
      if (!note) {
        return {
          success: false,
          error: `Note with id ${noteId} not found`,
        };
      }
      
      // Don't add the tag if it already exists
      if (note.tags.includes(tag)) {
        return { success: true };
      }
      
      // Add the new tag
      const updatedTags = [...note.tags, tag];
      
      const updatedNote = await repository.updateNote(noteId, {
        tags: updatedTags,
      });
      
      if (!updatedNote) {
        return {
          success: false,
          error: `Failed to update note with id ${noteId}`,
        };
      }
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error adding tag:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
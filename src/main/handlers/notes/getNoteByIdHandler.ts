import { GetNoteByIdQuery, GetNoteByIdResult } from '../../../shared/queries/noteQueries';
import { NoteRepository } from '../../persistence/NoteRepository';

export function getNoteByIdHandler(repository: NoteRepository) {
  return async (query: GetNoteByIdQuery): Promise<GetNoteByIdResult> => {
    try {
      const { id } = query.payload;
      
      const note = await repository.getNoteById(id);
      
      if (!note) {
        return {
          error: `Note with id ${id} not found`,
        };
      }
      
      return {
        note,
      };
    } catch (error) {
      console.error('Error getting note by id:', error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
} 
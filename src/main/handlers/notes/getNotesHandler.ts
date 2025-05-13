import { GetNotesQuery, GetNotesResult } from '../../../shared/queries/noteQueries';
import { NoteRepository } from '../../persistence/NoteRepository';

export function getNotesHandler(repository: NoteRepository) {
  return async (query: GetNotesQuery): Promise<GetNotesResult> => {
    try {
      const { searchTerm, tags, skip, take } = query.payload;
      
      const result = await repository.searchNotes(searchTerm, tags, skip, take);
      
      return {
        notes: result.notes,
        total: result.total,
      };
    } catch (error) {
      console.error('Error getting notes:', error);
      return {
        notes: [],
        total: 0,
      };
    }
  };
} 
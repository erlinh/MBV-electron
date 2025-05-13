import { GetTagsQuery, GetTagsResult } from '../../../shared/queries/noteQueries';
import { NoteRepository } from '../../persistence/NoteRepository';

export function getTagsHandler(repository: NoteRepository) {
  return async (query: GetTagsQuery): Promise<GetTagsResult> => {
    try {
      const tags = await repository.getAllTags();
      
      return {
        tags,
      };
    } catch (error) {
      console.error('Error getting tags:', error);
      return {
        tags: [],
      };
    }
  };
} 
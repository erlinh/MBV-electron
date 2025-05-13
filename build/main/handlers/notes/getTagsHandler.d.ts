import { GetTagsQuery, GetTagsResult } from '../../../shared/queries/noteQueries';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function getTagsHandler(repository: NoteRepository): (query: GetTagsQuery) => Promise<GetTagsResult>;

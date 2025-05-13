import { GetNotesQuery, GetNotesResult } from '../../../shared/queries/noteQueries';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function getNotesHandler(repository: NoteRepository): (query: GetNotesQuery) => Promise<GetNotesResult>;

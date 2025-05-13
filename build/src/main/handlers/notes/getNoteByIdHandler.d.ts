import { GetNoteByIdQuery, GetNoteByIdResult } from '../../../shared/queries/noteQueries';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function getNoteByIdHandler(repository: NoteRepository): (query: GetNoteByIdQuery) => Promise<GetNoteByIdResult>;

import { Message, NoteModel } from '../models/types';
export interface GetNotesQuery extends Message {
    type: 'GetNotesQuery';
    payload: {
        searchTerm?: string;
        tags?: string[];
        skip?: number;
        take?: number;
    };
}
export interface GetNotesResult {
    notes: NoteModel[];
    total: number;
}
export interface GetNoteByIdQuery extends Message {
    type: 'GetNoteByIdQuery';
    payload: {
        id: string;
    };
}
export interface GetNoteByIdResult {
    note?: NoteModel;
    error?: string;
}
export interface GetTagsQuery extends Message {
    type: 'GetTagsQuery';
    payload: Record<string, never>;
}
export interface GetTagsResult {
    tags: string[];
}

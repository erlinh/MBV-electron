import { Message, NoteModel } from '../models/types';

// Get Notes Query
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

// Get Note By ID Query
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

// Get Tags Query
export interface GetTagsQuery extends Message {
  type: 'GetTagsQuery';
  payload: Record<string, never>; // Empty payload
}

export interface GetTagsResult {
  tags: string[];
} 
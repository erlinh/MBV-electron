import { Message } from '../models/types';

// Create Note Command
export interface CreateNoteCommand extends Message {
  type: 'CreateNoteCommand';
  payload: {
    title: string;
    content: string;
    tags?: string[];
  };
}

export interface CreateNoteResult {
  success: boolean;
  noteId: string;
  error?: string;
}

// Update Note Command
export interface UpdateNoteCommand extends Message {
  type: 'UpdateNoteCommand';
  payload: {
    id: string;
    title?: string;
    content?: string;
    tags?: string[];
  };
}

export interface UpdateNoteResult {
  success: boolean;
  error?: string;
}

// Delete Note Command
export interface DeleteNoteCommand extends Message {
  type: 'DeleteNoteCommand';
  payload: {
    id: string;
  };
}

export interface DeleteNoteResult {
  success: boolean;
  error?: string;
}

// Add Tag to Note Command
export interface AddTagCommand extends Message {
  type: 'AddTagCommand';
  payload: {
    noteId: string;
    tag: string;
  };
}

export interface AddTagResult {
  success: boolean;
  error?: string;
} 
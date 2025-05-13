import { Message } from '../models/types';
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

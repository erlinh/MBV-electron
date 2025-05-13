import { MessageBus } from '../../../shared/models/types';
import { NoteRepository } from '../../persistence/NoteRepository';
import { createNoteHandler } from './createNoteHandler';
import { updateNoteHandler } from './updateNoteHandler';
import { deleteNoteHandler } from './deleteNoteHandler';
import { addTagHandler } from './addTagHandler';
import { getNotesHandler } from './getNotesHandler';
import { getNoteByIdHandler } from './getNoteByIdHandler';
import { getTagsHandler } from './getTagsHandler';

// Create a singleton repository
const noteRepository = new NoteRepository();

export function registerNoteHandlers(messageBus: MessageBus): void {
  // Register command handlers
  messageBus.registerHandler('CreateNoteCommand', createNoteHandler(noteRepository));
  messageBus.registerHandler('UpdateNoteCommand', updateNoteHandler(noteRepository));
  messageBus.registerHandler('DeleteNoteCommand', deleteNoteHandler(noteRepository));
  messageBus.registerHandler('AddTagCommand', addTagHandler(noteRepository));
  
  // Register query handlers
  messageBus.registerHandler('GetNotesQuery', getNotesHandler(noteRepository));
  messageBus.registerHandler('GetNoteByIdQuery', getNoteByIdHandler(noteRepository));
  messageBus.registerHandler('GetTagsQuery', getTagsHandler(noteRepository));
} 
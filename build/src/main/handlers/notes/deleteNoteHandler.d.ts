import { DeleteNoteCommand, DeleteNoteResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function deleteNoteHandler(repository: NoteRepository): (command: DeleteNoteCommand) => Promise<DeleteNoteResult>;

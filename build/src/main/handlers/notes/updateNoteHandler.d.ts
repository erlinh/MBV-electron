import { UpdateNoteCommand, UpdateNoteResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function updateNoteHandler(repository: NoteRepository): (command: UpdateNoteCommand) => Promise<UpdateNoteResult>;

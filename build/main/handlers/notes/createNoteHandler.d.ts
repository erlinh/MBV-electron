import { CreateNoteCommand, CreateNoteResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function createNoteHandler(repository: NoteRepository): (command: CreateNoteCommand) => Promise<CreateNoteResult>;

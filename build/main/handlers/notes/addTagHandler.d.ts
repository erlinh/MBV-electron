import { AddTagCommand, AddTagResult } from '../../../shared/commands/noteCommands';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function addTagHandler(repository: NoteRepository): (command: AddTagCommand) => Promise<AddTagResult>;

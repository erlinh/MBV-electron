import { ImportDataCommand, ImportDataResult } from '../../../shared/commands/preferenceCommands';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function importDataHandler(repository: NoteRepository): (command: ImportDataCommand) => Promise<ImportDataResult>;

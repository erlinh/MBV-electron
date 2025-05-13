import { ExportDataCommand, ExportDataResult } from '../../../shared/commands/preferenceCommands';
import { NoteRepository } from '../../persistence/NoteRepository';
export declare function exportDataHandler(repository: NoteRepository): (command: ExportDataCommand) => Promise<ExportDataResult>;

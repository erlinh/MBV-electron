import { MessageBus } from '../../../shared/models/types';
import { PreferencesRepository } from '../../persistence/PreferencesRepository';
import { NoteRepository } from '../../persistence/NoteRepository';
import { updatePreferencesHandler } from './updatePreferencesHandler';
import { getPreferencesHandler } from './getPreferencesHandler';
import { importDataHandler } from './importDataHandler';
import { exportDataHandler } from './exportDataHandler';

// Create singleton repositories
const preferencesRepository = new PreferencesRepository();
const noteRepository = new NoteRepository();

export function registerPreferenceHandlers(messageBus: MessageBus): void {
  // Register command handlers
  messageBus.registerHandler('UpdatePreferencesCommand', updatePreferencesHandler(preferencesRepository));
  messageBus.registerHandler('ImportDataCommand', importDataHandler(noteRepository));
  messageBus.registerHandler('ExportDataCommand', exportDataHandler(noteRepository));
  
  // Register query handlers
  messageBus.registerHandler('GetPreferencesQuery', getPreferencesHandler(preferencesRepository));
} 
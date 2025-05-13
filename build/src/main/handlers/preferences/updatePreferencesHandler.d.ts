import { UpdatePreferencesCommand, UpdatePreferencesResult } from '../../../shared/commands/preferenceCommands';
import { PreferencesRepository } from '../../persistence/PreferencesRepository';
export declare function updatePreferencesHandler(repository: PreferencesRepository): (command: UpdatePreferencesCommand) => Promise<UpdatePreferencesResult>;

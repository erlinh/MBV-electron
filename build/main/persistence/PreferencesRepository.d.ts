import { UserPreferences } from '../../shared/models/types';
export declare class PreferencesRepository {
    private storageDir;
    private preferencesFile;
    private preferences;
    constructor();
    private initStorage;
    private loadPreferences;
    private savePreferences;
    getPreferences(): Promise<UserPreferences>;
    updatePreferences(updates: Partial<UserPreferences>): Promise<UserPreferences>;
}

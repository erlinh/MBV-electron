import { Message, UserPreferences } from '../models/types';
export interface GetPreferencesQuery extends Message {
    type: 'GetPreferencesQuery';
    payload: Record<string, never>;
}
export interface GetPreferencesResult {
    preferences: UserPreferences;
}

import { Message, UserPreferences } from '../models/types';

// Get Preferences Query
export interface GetPreferencesQuery extends Message {
  type: 'GetPreferencesQuery';
  payload: Record<string, never>; // Empty payload
}

export interface GetPreferencesResult {
  preferences: UserPreferences;
} 
import { Message } from '../models/types';

// Update Preferences Command
export interface UpdatePreferencesCommand extends Message {
  type: 'UpdatePreferencesCommand';
  payload: {
    theme?: 'light' | 'dark';
    fontSize?: number;
    autoSave?: boolean;
  };
}

export interface UpdatePreferencesResult {
  success: boolean;
  error?: string;
}

// Import Data Command
export interface ImportDataCommand extends Message {
  type: 'ImportDataCommand';
  payload: {
    data: string; // JSON string containing notes
  };
}

export interface ImportDataResult {
  success: boolean;
  count: number; // Number of imported notes
  error?: string;
}

// Export Data Command
export interface ExportDataCommand extends Message {
  type: 'ExportDataCommand';
  payload: {
    format: 'json' | 'markdown';
  };
}

export interface ExportDataResult {
  success: boolean;
  data?: string; // Exported data in specified format
  error?: string;
} 
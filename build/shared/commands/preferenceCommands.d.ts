import { Message } from '../models/types';
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
export interface ImportDataCommand extends Message {
    type: 'ImportDataCommand';
    payload: {
        data: string;
    };
}
export interface ImportDataResult {
    success: boolean;
    count: number;
    error?: string;
}
export interface ExportDataCommand extends Message {
    type: 'ExportDataCommand';
    payload: {
        format: 'json' | 'markdown';
    };
}
export interface ExportDataResult {
    success: boolean;
    data?: string;
    error?: string;
}

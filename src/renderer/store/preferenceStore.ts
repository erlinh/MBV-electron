import { create } from 'zustand';
import { ClientMessageBus } from '../messageBus/ClientMessageBus';
import { UserPreferences } from '../../shared/models/types';
import { 
  UpdatePreferencesCommand, 
  ImportDataCommand, 
  ExportDataCommand 
} from '../../shared/commands/preferenceCommands';
import { GetPreferencesQuery } from '../../shared/queries/preferenceQueries';

// Create a singleton message bus (or reuse the same instance from noteStore)
const messageBus = new ClientMessageBus();

// Types for the store
interface PreferenceState {
  preferences: UserPreferences;
  isLoading: boolean;
  error: string | null;
  importStatus: { success: boolean; count: number } | null;
  exportedData: string | null;
  
  // Actions
  fetchPreferences: () => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  importData: (data: string) => Promise<void>;
  exportData: (format: 'json' | 'markdown') => Promise<void>;
  clearExportedData: () => void;
  clearImportStatus: () => void;
  clearError: () => void;
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'light',
  fontSize: 14,
  autoSave: true,
};

// Create the store
export const usePreferenceStore = create<PreferenceState>((set, get) => ({
  preferences: defaultPreferences,
  isLoading: false,
  error: null,
  importStatus: null,
  exportedData: null,
  
  fetchPreferences: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const query: GetPreferencesQuery = {
        type: 'GetPreferencesQuery',
        payload: {}
      };
      
      const result = await messageBus.send<any>(query);
      
      set({ 
        preferences: result.preferences, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch preferences', 
        isLoading: false 
      });
    }
  },
  
  updatePreferences: async (preferences) => {
    set({ isLoading: true, error: null });
    
    try {
      const command: UpdatePreferencesCommand = {
        type: 'UpdatePreferencesCommand',
        payload: preferences
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      // Update preferences directly with the result
      if (result.preferences) {
        set({ 
          preferences: result.preferences,
          isLoading: false 
        });
      } else {
        // Fallback to refreshing preferences from server
        await get().fetchPreferences();
        set({ isLoading: false });
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update preferences', 
        isLoading: false 
      });
    }
  },
  
  importData: async (data) => {
    set({ isLoading: true, error: null, importStatus: null });
    
    try {
      const command: ImportDataCommand = {
        type: 'ImportDataCommand',
        payload: { data }
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      set({ 
        importStatus: { success: true, count: result.count }, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error importing data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to import data', 
        isLoading: false 
      });
    }
  },
  
  exportData: async (format) => {
    set({ isLoading: true, error: null, exportedData: null });
    
    try {
      const command: ExportDataCommand = {
        type: 'ExportDataCommand',
        payload: { format }
      };
      
      const result = await messageBus.send<any>(command);
      
      if (!result.success) {
        set({ error: result.error, isLoading: false });
        return;
      }
      
      set({ exportedData: result.data, isLoading: false });
    } catch (error) {
      console.error('Error exporting data:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to export data', 
        isLoading: false 
      });
    }
  },
  
  clearExportedData: () => {
    set({ exportedData: null });
  },
  
  clearImportStatus: () => {
    set({ importStatus: null });
  },
  
  clearError: () => {
    set({ error: null });
  }
})); 
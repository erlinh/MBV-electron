// Import repositories
const { PreferencesRepository } = require('../../persistence/PreferencesRepository');
const { NoteRepository } = require('../../persistence/NoteRepository');

// Create singleton repositories
const preferencesRepository = new PreferencesRepository();
const noteRepository = new NoteRepository();

function updatePreferencesHandler() {
  return async (command) => {
    try {
      const { preferences } = command.payload;
      
      await preferencesRepository.updatePreferences(preferences);
      
      return {
        success: true,
      };
    } catch (error) {
      console.error('Error updating preferences:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function importDataHandler() {
  return async (command) => {
    try {
      const { data } = command.payload;
      
      const count = await noteRepository.importNotes(data);
      
      return {
        success: true,
        count,
      };
    } catch (error) {
      console.error('Error importing data:', error);
      return {
        success: false,
        count: 0,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function exportDataHandler() {
  return async (command) => {
    try {
      const { format } = command.payload;
      
      const data = await noteRepository.exportNotes(format);
      
      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error('Error exporting data:', error);
      return {
        success: false,
        data: '',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function getPreferencesHandler() {
  return async () => {
    try {
      const preferences = await preferencesRepository.getPreferences();
      
      return {
        preferences,
      };
    } catch (error) {
      console.error('Error getting preferences:', error);
      return {
        preferences: {},
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  };
}

function registerPreferenceHandlers(messageBus) {
  // Register command handlers
  messageBus.registerHandler('UpdatePreferencesCommand', updatePreferencesHandler());
  messageBus.registerHandler('ImportDataCommand', importDataHandler());
  messageBus.registerHandler('ExportDataCommand', exportDataHandler());
  
  // Register query handlers
  messageBus.registerHandler('GetPreferencesQuery', getPreferencesHandler());
}

module.exports = { registerPreferenceHandlers }; 
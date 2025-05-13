"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPreferenceHandlers = registerPreferenceHandlers;
const PreferencesRepository_1 = require("../../persistence/PreferencesRepository");
const NoteRepository_1 = require("../../persistence/NoteRepository");
const updatePreferencesHandler_1 = require("./updatePreferencesHandler");
const getPreferencesHandler_1 = require("./getPreferencesHandler");
const importDataHandler_1 = require("./importDataHandler");
const exportDataHandler_1 = require("./exportDataHandler");
// Create singleton repositories
const preferencesRepository = new PreferencesRepository_1.PreferencesRepository();
const noteRepository = new NoteRepository_1.NoteRepository();
function registerPreferenceHandlers(messageBus) {
    // Register command handlers
    messageBus.registerHandler('UpdatePreferencesCommand', (0, updatePreferencesHandler_1.updatePreferencesHandler)(preferencesRepository));
    messageBus.registerHandler('ImportDataCommand', (0, importDataHandler_1.importDataHandler)(noteRepository));
    messageBus.registerHandler('ExportDataCommand', (0, exportDataHandler_1.exportDataHandler)(noteRepository));
    // Register query handlers
    messageBus.registerHandler('GetPreferencesQuery', (0, getPreferencesHandler_1.getPreferencesHandler)(preferencesRepository));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageBus = void 0;
exports.setupIpcHandlers = setupIpcHandlers;
const electron_1 = require("electron");
const MessageBus_1 = require("./MessageBus");
const LoggingMiddleware_1 = require("../middleware/LoggingMiddleware");
const ValidationMiddleware_1 = require("../middleware/ValidationMiddleware");
const MetricsMiddleware_1 = require("../middleware/MetricsMiddleware");
// Import handlers
const notes_1 = require("../handlers/notes");
const preferences_1 = require("../handlers/preferences");
// Create a singleton message bus
exports.messageBus = new MessageBus_1.ElectronMessageBus();
// Setup the IPC handlers
function setupIpcHandlers() {
    // Register middlewares
    exports.messageBus.use(new LoggingMiddleware_1.LoggingMiddleware());
    exports.messageBus.use(new ValidationMiddleware_1.ValidationMiddleware());
    exports.messageBus.use(new MetricsMiddleware_1.MetricsMiddleware());
    // Register handlers
    (0, notes_1.registerNoteHandlers)(exports.messageBus);
    (0, preferences_1.registerPreferenceHandlers)(exports.messageBus);
    // Set up the main IPC handler
    electron_1.ipcMain.handle('message', async (event, { channel, message }) => {
        try {
            const result = await exports.messageBus.send(message);
            return result;
        }
        catch (error) {
            console.error(`Error handling message of type ${message.type}:`, error);
            return {
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    });
}

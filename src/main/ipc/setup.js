const { ipcMain } = require('electron');
const { ElectronMessageBus } = require('./MessageBus');
const { LoggingMiddleware } = require('../middleware/LoggingMiddleware');
const { ValidationMiddleware } = require('../middleware/ValidationMiddleware');
const { MetricsMiddleware } = require('../middleware/MetricsMiddleware');

// Import JavaScript handlers
const { registerNoteHandlers } = require('../handlers/notes/index.js');
const { registerPreferenceHandlers } = require('../handlers/preferences/index.js');

// Create a singleton message bus
const messageBus = new ElectronMessageBus();

// Setup the IPC handlers
function setupIpcHandlers() {
  // Register middlewares
  messageBus.use(new LoggingMiddleware());
  messageBus.use(new ValidationMiddleware());
  messageBus.use(new MetricsMiddleware());

  // Register handlers
  registerNoteHandlers(messageBus);
  registerPreferenceHandlers(messageBus);

  // Set up the main IPC handler
  ipcMain.handle('message', async (event, { channel, message }) => {
    try {
      const result = await messageBus.send(message);
      return result;
    } catch (error) {
      console.error(`Error handling message of type ${message.type}:`, error);
      return {
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  });
}

module.exports = {
  setupIpcHandlers,
  messageBus
}; 
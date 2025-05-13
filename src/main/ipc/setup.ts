import { ipcMain } from 'electron';
import { ElectronMessageBus } from './MessageBus';
import { LoggingMiddleware } from '../middleware/LoggingMiddleware';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { MetricsMiddleware } from '../middleware/MetricsMiddleware';

// Import handlers
import { registerNoteHandlers } from '../handlers/notes';
import { registerPreferenceHandlers } from '../handlers/preferences';

// Create a singleton message bus
export const messageBus = new ElectronMessageBus();

// Setup the IPC handlers
export function setupIpcHandlers() {
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
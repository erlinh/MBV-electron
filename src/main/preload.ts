// Use more modern type import approach for Electron
const { contextBridge, ipcRenderer } = require('electron');

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development';
console.log(`[Preload] Running in ${isDev ? 'development' : 'production'} mode`);

// Define the Electron API interface
interface ElectronAPI {
  messageBus: {
    send: (channel: string, message: any) => Promise<any>;
    on: (channel: string, callback: (response: any) => void) => () => void;
  };
  isDev: boolean;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  messageBus: {
    send: (channel: string, message: any) => {
      return ipcRenderer.invoke('message', { channel, message });
    },
    on: (channel: string, callback: (response: any) => void) => {
      // Using a custom event listener wrapper to avoid exposing ipcRenderer directly
      const listener = (_: any, { responseChannel, response }: { responseChannel: string, response: any }) => {
        if (channel === responseChannel) {
          callback(response);
        }
      };
      
      ipcRenderer.on('message-response', listener);
      
      // Return a function to remove the listener
      return () => {
        ipcRenderer.removeListener('message-response', listener);
      };
    }
  },
  isDev: isDev
} as ElectronAPI); 
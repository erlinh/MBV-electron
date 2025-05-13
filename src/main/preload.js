const { contextBridge, ipcRenderer } = require('electron');

// Determine if we're in development mode
const isDev = process.env.NODE_ENV === 'development';
console.log(`[Preload] Running in ${isDev ? 'development' : 'production'} mode`);

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  messageBus: {
    send: (channel, message) => {
      return ipcRenderer.invoke('message', { channel, message });
    },
    on: (channel, callback) => {
      // Using a custom event listener wrapper to avoid exposing ipcRenderer directly
      const listener = (_, { responseChannel, response }) => {
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
}); 
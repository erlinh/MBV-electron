// Mock Electron's contextBridge API
global.window = {
  electron: {
    messageBus: {
      send: jest.fn().mockImplementation(() => Promise.resolve()),
      on: jest.fn().mockImplementation(() => () => {}),
    },
    isDev: true,
  },
};

// Suppress console.error output in tests
console.error = jest.fn();

// Add any other global mocks or setup here 
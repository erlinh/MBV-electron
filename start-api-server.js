// Standalone script to start the API server for debugging
console.log('Starting API server in standalone mode...');

// Set environment variables
process.env.NODE_ENV = 'development';

// Load the API server
try {
  require('./src/main/api/server');
  console.log('API server loaded successfully');
} catch (error) {
  console.error('Failed to load API server:', error);
} 
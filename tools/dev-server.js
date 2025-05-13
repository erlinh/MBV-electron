const { spawn } = require('child_process');
const { createServer } = require('vite');
const electron = require('electron');
const path = require('path');
const waitOn = require('wait-on');

/**
 * Development server that integrates Vite with Electron.
 * - Starts Vite dev server for renderer process
 * - Watches changes to main process files
 * - Launches Electron when Vite server is ready
 */
async function startDevServer() {
  console.log('Starting dev server...');
  
  try {
    // Create Vite server
    const vite = await createServer({
      configFile: path.join(__dirname, '../vite.config.ts'),
      server: {
        port: 3000,
      },
      clearScreen: false,
    });

    // Start Vite server
    await vite.listen(3000);
    
    console.log('Vite server started at http://localhost:3000');

    // Set environment variables for Electron
    const env = {
      ...process.env,
      NODE_ENV: 'development',
      VITE_DEV_SERVER_URL: 'http://localhost:3000',
      API_PORT: '3002', // Explicitly set API port
    };

    // Wait for Vite server to be ready
    console.log('Waiting for Vite server to be ready...');
    await waitOn({ resources: ['http-get://localhost:3000'], timeout: 10000 });
    console.log('Vite server is ready!');

    // Start Electron with the built TypeScript file
    console.log('Starting Electron...');
    const electronProcess = spawn(electron, ['build/electron.js'], {
      stdio: 'inherit',
      env: env
    });

    // Handle Electron exit
    electronProcess.on('close', (code) => {
      console.log(`Electron process exited with code ${code}`);
      vite.close();
      process.exit(code);
    });

    // Handle process exit
    process.on('SIGINT', () => {
      console.log('Shutting down dev server...');
      electronProcess.kill();
      vite.close();
      process.exit();
    });
  } catch (err) {
    console.error('Error starting dev server:', err);
    process.exit(1);
  }
}

startDevServer(); 
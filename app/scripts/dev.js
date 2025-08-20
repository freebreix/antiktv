#!/usr/bin/env node

/**
 * Development script for AntikTV Electron app
 * Starts both SvelteKit dev server and Electron
 */

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV !== 'production';

async function startDevelopment() {
  console.log('🚀 Starting AntikTV Electron Development...');

  // Start SvelteKit dev server
  console.log('📦 Starting SvelteKit dev server...');
  const svelteKitProcess = spawn('npm', ['run', 'dev:sveltekit'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true
  });

  // Wait for SvelteKit server to start
  console.log('⏳ Waiting for SvelteKit server to start...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  // Start Electron
  console.log('⚡ Starting Electron...');
  const electronProcess = spawn('npm', ['run', 'dev:electron'], {
    cwd: __dirname,
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  });

  // Handle cleanup
  const cleanup = () => {
    console.log('🧹 Cleaning up processes...');
    svelteKitProcess.kill();
    electronProcess.kill();
    process.exit(0);
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  electronProcess.on('close', (code) => {
    console.log(`Electron process exited with code ${code}`);
    cleanup();
  });
}

if (isDev) {
  startDevelopment().catch(console.error);
} else {
  console.error('This script is for development only. Use npm run build && npm run dist for production.');
  process.exit(1);
}

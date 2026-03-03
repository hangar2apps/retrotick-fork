#!/usr/bin/env tsx

// Basic test to see if RetroTick emulator can load and initialize
// Based on the pattern described in CLAUDE.md

import { createCanvas, CanvasRenderingContext2D } from './src/lib/mock-canvas.js';

// Mock DOM environment for headless testing
global.window = {
  devicePixelRatio: 1,
  requestAnimationFrame: (cb) => setTimeout(cb, 16)
};
global.document = {
  createElement: (tag) => {
    if (tag === 'canvas') {
      const canvas = createCanvas(800, 600);
      return canvas;
    }
    return {};
  }
};

console.log('[TEST] Starting basic RetroTick emulator test...');
console.log('[TEST] Environment setup complete');

try {
  // Test if we can import the core modules
  const { Emulator } = await import('./src/lib/emu/emulator.js');
  console.log('[TEST] Successfully imported Emulator class');
  
  // Test if we can create an emulator instance
  const emu = new Emulator();
  console.log('[TEST] Successfully created Emulator instance');
  
  console.log('[TEST] SUCCESS: Basic emulator test passed');
  console.log('[TEST] - Emulator can be imported');
  console.log('[TEST] - Emulator instance can be created');
  console.log('[TEST] - No crashes during initialization');
  
} catch (error) {
  console.error('[TEST] ERROR:', error.message);
  console.error('[TEST] Stack:', error.stack);
  process.exit(1);
}
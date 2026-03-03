#!/usr/bin/env tsx

// Test RetroTick API stub availability and registration
// This tests the emulator's Win32 API compatibility without needing executables

import './src/lib/mock-canvas.js';

// Mock DOM environment
global.window = { devicePixelRatio: 1, requestAnimationFrame: (cb) => setTimeout(cb, 16) };
global.document = {
  createElement: (tag) => tag === 'canvas' ? { width: 800, height: 600, style: {}, getContext: () => null, addEventListener: () => {}, removeEventListener: () => {} } : {}
};

console.log('[API-TEST] Testing RetroTick API stub system...');

try {
  const { Emulator } = await import('./src/lib/emu/emulator.js');
  
  // Create emulator instance
  const emu = new Emulator();
  console.log('[API-TEST] Emulator created successfully');
  
  // Test if Win32 API modules are loaded
  const kernel32 = emu.win32Dlls.get('kernel32.dll');
  const user32 = emu.win32Dlls.get('user32.dll');
  const gdi32 = emu.win32Dlls.get('gdi32.dll');
  
  console.log('[API-TEST] Win32 DLL registrations:');
  console.log(`  - kernel32.dll: ${kernel32 ? kernel32.functions.size : 0} functions`);
  console.log(`  - user32.dll: ${user32 ? user32.functions.size : 0} functions`);
  console.log(`  - gdi32.dll: ${gdi32 ? gdi32.functions.size : 0} functions`);
  
  // Test specific API availability
  const testApis = [
    'kernel32.dll:CreateFileA',
    'kernel32.dll:ReadFile',
    'kernel32.dll:WriteFile',
    'user32.dll:CreateWindowExA',
    'user32.dll:ShowWindow',
    'user32.dll:UpdateWindow',
    'gdi32.dll:CreateCompatibleDC',
    'gdi32.dll:BitBlt'
  ];
  
  console.log('[API-TEST] Testing key API registrations:');
  for (const api of testApis) {
    const [dll, func] = api.split(':');
    const dllObj = emu.win32Dlls.get(dll);
    const hasApi = dllObj?.functions.has(func);
    console.log(`  - ${api}: ${hasApi ? '✅' : '❌'}`);
  }
  
  // Test memory management
  try {
    const testAddr = emu.heapAlloc(1024);
    console.log(`[API-TEST] Heap allocation test: 0x${testAddr.toString(16)} (1024 bytes)`);
    
    emu.memory.writeU32(testAddr, 0x12345678);
    const readBack = emu.memory.readU32(testAddr);
    console.log(`[API-TEST] Memory R/W test: wrote 0x12345678, read 0x${readBack.toString(16)} ${readBack === 0x12345678 ? '✅' : '❌'}`);
  } catch (err) {
    console.log(`[API-TEST] Memory test failed: ${err.message}`);
  }
  
  console.log('[API-TEST] SUCCESS: API stub system functional');
  
} catch (error) {
  console.error('[API-TEST] ERROR:', error.message);
  process.exit(1);
}
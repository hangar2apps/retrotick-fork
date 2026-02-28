import type { Emulator } from '../emulator';

export function registerSecur32(emu: Emulator): void {
  const secur32 = emu.registerDll('SECUR32.DLL');

  // GetUserNameExW(NameFormat, lpNameBuffer, nSize) — 3 args
  secur32.register('GetUserNameExW', 3, () => {
    const lpNameBuffer = emu.readArg(1);
    const nSize = emu.readArg(2);
    const name = 'User';
    if (lpNameBuffer && nSize) {
      const maxLen = emu.memory.readU32(nSize);
      const len = Math.min(name.length, maxLen - 1);
      for (let i = 0; i < len; i++) emu.memory.writeU16(lpNameBuffer + i * 2, name.charCodeAt(i));
      emu.memory.writeU16(lpNameBuffer + len * 2, 0);
      emu.memory.writeU32(nSize, len);
    }
    return 1; // success
  });
}

import type { Emulator } from '../emulator';

// Win16 SOUND.DRV — sound driver stubs (no audio)

export function registerWin16Sound(emu: Emulator): void {
  const sound = emu.registerModule16('SOUND');

  // Ordinal 1: OpenSound() — 0 bytes
  sound.register('ord_1', 0, () => 1);
  // Ordinal 2: CloseSound() — 0 bytes
  sound.register('ord_2', 0, () => 0);
  // Ordinal 4: SetVoiceNote(word word word word) — 8 bytes
  sound.register('ord_4', 8, () => 0);
  // Ordinal 5: SetVoiceAccent(word word word word word) — 10 bytes
  sound.register('ord_5', 10, () => 0);
  // Ordinal 9: StartSound() — 0 bytes
  sound.register('ord_9', 0, () => 0);
  // Ordinal 10: StopSound() — 0 bytes
  sound.register('ord_10', 0, () => 0);
}

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

class MockCtx {
  fillStyle = '#000'; strokeStyle = '#000'; font = '12px sans-serif';
  textBaseline = 'top'; lineWidth = 1; globalCompositeOperation = 'source-over';
  fillRect() {} clearRect() {} strokeRect() {} drawImage() {}
  getImageData(x, y, w, h) { return { data: new Uint8ClampedArray(w * h * 4) }; }
  putImageData() {} beginPath() {} closePath() {} moveTo() {} lineTo() {}
  arc() {} ellipse() {} fill() {} stroke() {} fillText() {}
  measureText() { return { width: 0 }; } save() {} restore() {}
  scale() {} translate() {} setTransform() {}
  createImageData(w, h) { return { data: new Uint8ClampedArray(w * h * 4), width: w, height: h }; }
  clip() {} rect() {} setLineDash() {} quadraticCurveTo() {} bezierCurveTo() {}
  createLinearGradient() { return { addColorStop() {} }; }
  createPattern() { return {}; }
  roundRect() {}
  getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; }
}

class MockCanvas {
  constructor(w = 1, h = 1) { this.width = w; this.height = h; this.style = {}; }
  getContext() { return new MockCtx(); }
}

globalThis.requestAnimationFrame = (cb) => setImmediate(cb);

globalThis.OffscreenCanvas = class OffscreenCanvas {
  constructor(w, h) { this.width = w; this.height = h; }
  getContext() { return new MockCtx(); }
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const { parsePE } = await import('./src/lib/pe/parse.ts');
  const { Emulator } = await import('./src/lib/emu/emulator.ts');

  const buf = readFileSync(join(__dirname, 'examples', 'SPIDER_F.EXE'));
  const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
  const pe = parsePE(ab);

  const emu = new Emulator();

  // Load cards.dll as additional file (Spider Solitaire likely needs it)
  try {
    const cardsBuf = readFileSync(join(__dirname, 'examples', 'cards.dll'));
    const cardsAb = cardsBuf.buffer.slice(cardsBuf.byteOffset, cardsBuf.byteOffset + cardsBuf.byteLength);
    emu.additionalFiles.set('cards.dll', cardsAb);
  } catch {}

  await emu.load(ab, pe, new MockCanvas(800, 600));

  emu.run();
  const start = Date.now();
  while (Date.now() - start < 5000 && !emu.waitingForMessage && !emu.halted) {
    await new Promise(r => setTimeout(r, 10));
  }

  if (emu.halted) {
    console.log(`[TEST] FAILED: Halted at eip=0x${(emu.cpu.eip >>> 0).toString(16)}, reason: ${emu.haltReason}`);
    return;
  }

  if (!emu.waitingForMessage) {
    console.log('[TEST] FAILED: Did not reach message loop');
    return;
  }

  console.log('[TEST] Reached message loop');

  // Check if FREEWARE NOTICE dialog is showing
  if (emu.dialogState) {
    console.log(`[TEST] Dialog: "${emu.dialogState.info.title}" hwnd=0x${emu.dialogState.hwnd.toString(16)}`);

    // Find OK button (IDOK = 1)
    const okOverlay = emu.dialogState.info.overlays?.find(o => o.controlId === 1);
    if (okOverlay) {
      console.log(`[TEST] Found OK button: controlId=${okOverlay.controlId} title="${okOverlay.title}"`);
    }

    // Dismiss with IDOK
    console.log('[TEST] Dismissing dialog with IDOK...');
    emu.dismissDialog(1, new Map());
    await sleep(500);

    if (emu.halted) {
      console.log(`[TEST] FAILED: Crashed after dismissDialog at eip=0x${(emu.cpu.eip >>> 0).toString(16)}, reason: ${emu.haltReason}`);
      return;
    }

    if (emu.dialogState) {
      console.log(`[TEST] FAILED: Dialog still open after dismiss`);
      return;
    }

    console.log('[TEST] Dialog dismissed successfully');
  }

  console.log('[TEST] SUCCESS');
}

main().catch(e => console.error(e));

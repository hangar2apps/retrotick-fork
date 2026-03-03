// Mock Canvas implementation for headless testing

export class CanvasRenderingContext2D {
  constructor() {
    this.fillStyle = '#000000';
    this.strokeStyle = '#000000';
    this.lineWidth = 1;
    this.font = '16px Arial';
    this.textAlign = 'start';
    this.textBaseline = 'alphabetic';
  }
  
  fillRect(x, y, w, h) {}
  clearRect(x, y, w, h) {}
  strokeRect(x, y, w, h) {}
  fillText(text, x, y) {}
  strokeText(text, x, y) {}
  measureText(text) {
    return { width: text.length * 8 }; // Rough estimate
  }
  
  beginPath() {}
  closePath() {}
  moveTo(x, y) {}
  lineTo(x, y) {}
  arc(x, y, radius, startAngle, endAngle) {}
  fill() {}
  stroke() {}
  
  save() {}
  restore() {}
  translate(x, y) {}
  rotate(angle) {}
  scale(x, y) {}
  
  getImageData(x, y, w, h) {
    const data = new Uint8ClampedArray(w * h * 4);
    return { data, width: w, height: h };
  }
  
  putImageData(imageData, x, y) {}
  
  drawImage(...args) {}
}

export function createCanvas(width = 800, height = 600) {
  const canvas = {
    width,
    height,
    style: {},
    getContext: (type) => {
      if (type === '2d') {
        return new CanvasRenderingContext2D();
      }
      return null;
    },
    toDataURL: () => 'data:image/png;base64,',
    addEventListener: () => {},
    removeEventListener: () => {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width, height })
  };
  
  return canvas;
}
// Generates icon-192.png and icon-512.png using only Node.js built-ins.
// Run: node generate-icons.js
import fs from 'fs';
import zlib from 'zlib';

const crcTable = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xFF];
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function pngChunk(type, data) {
  const t = Buffer.from(type, 'ascii');
  const l = Buffer.alloc(4); l.writeUInt32BE(data.length);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([l, t, data, c]);
}

function makePNG(size, drawFn) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2; // 8-bit depth, RGB color type

  // Pixel buffer: [R,G,B] per pixel
  const px = new Uint8Array(size * size * 3);

  // Fill background: #0a0a0c
  for (let i = 0; i < size * size; i++) { px[i*3]=10; px[i*3+1]=10; px[i*3+2]=12; }

  drawFn(px, size);

  // Build raw scanlines (1 filter byte per row)
  const raw = Buffer.alloc(size * (1 + size * 3));
  for (let y = 0; y < size; y++) {
    raw[y * (size * 3 + 1)] = 0; // filter: None
    for (let x = 0; x < size; x++) {
      const src = (y * size + x) * 3;
      const dst = y * (size * 3 + 1) + 1 + x * 3;
      raw[dst] = px[src]; raw[dst+1] = px[src+1]; raw[dst+2] = px[src+2];
    }
  }

  return Buffer.concat([
    Buffer.from([137,80,78,71,13,10,26,10]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', zlib.deflateSync(raw)),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

function set(px, size, x, y, r, g, b) {
  if (x < 0 || x >= size || y < 0 || y >= size) return;
  const i = (y * size + x) * 3;
  px[i]=r; px[i+1]=g; px[i+2]=b;
}

function fillRect(px, size, x, y, w, h, r, g, b) {
  for (let dy = 0; dy < h; dy++)
    for (let dx = 0; dx < w; dx++)
      set(px, size, x+dx, y+dy, r, g, b);
}

function fillCircle(px, size, cx, cy, cr, r, g, b) {
  for (let dy = -cr; dy <= cr; dy++)
    for (let dx = -cr; dx <= cr; dx++)
      if (dx*dx + dy*dy <= cr*cr) set(px, size, cx+dx, cy+dy, r, g, b);
}

function drawLine(px, size, x0, y0, x1, y1, sw, r, g, b) {
  const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
  const sx = x0<x1?1:-1, sy = y0<y1?1:-1;
  let err = dx - dy;
  while (true) {
    for (let ty = -sw; ty <= sw; ty++)
      for (let tx = -sw; tx <= sw; tx++)
        set(px, size, x0+tx, y0+ty, r, g, b);
    if (x0===x1 && y0===y1) break;
    const e2 = 2*err;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 < dx)  { err += dx; y0 += sy; }
  }
}

function drawIcon(px, size) {
  const s = size / 512;

  // Purple bars (section headers)
  fillRect(px, size, Math.floor(80*s), Math.floor(140*s), Math.floor(240*s), Math.floor(28*s), 167,139,250);
  fillRect(px, size, Math.floor(80*s), Math.floor(332*s), Math.floor(200*s), Math.floor(28*s), 167,139,250);

  // Gray bars (task items)
  fillRect(px, size, Math.floor(80*s), Math.floor(212*s), Math.floor(352*s), Math.floor(20*s), 75,85,99);
  fillRect(px, size, Math.floor(80*s), Math.floor(252*s), Math.floor(280*s), Math.floor(20*s), 75,85,99);
  fillRect(px, size, Math.floor(80*s), Math.floor(404*s), Math.floor(320*s), Math.floor(20*s), 75,85,99);

  // Purple circle badge
  const cx = Math.floor(388*s), cy = Math.floor(240*s), cr = Math.floor(68*s);
  fillCircle(px, size, cx, cy, cr, 124, 58, 237);

  // Checkmark inside circle
  const sw = Math.max(1, Math.floor(6*s));
  const p1x = Math.floor((388-28)*s), p1y = Math.floor(240*s);
  const p2x = Math.floor((388-8)*s), p2y = Math.floor((240+26)*s);
  const p3x = Math.floor((388+36)*s), p3y = Math.floor((240-24)*s);
  drawLine(px, size, p1x, p1y, p2x, p2y, sw, 255,255,255);
  drawLine(px, size, p2x, p2y, p3x, p3y, sw, 255,255,255);
}

fs.mkdirSync('public', { recursive: true });
fs.writeFileSync('public/icon-192.png', makePNG(192, drawIcon));
fs.writeFileSync('public/icon-512.png', makePNG(512, drawIcon));
console.log('Created public/icon-192.png and public/icon-512.png');

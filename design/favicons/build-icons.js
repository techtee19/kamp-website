const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const DIR = __dirname
const SRC = path.join(DIR, 'kamp-logo-source.png')

const BG = { r: 0x20, g: 0x20, b: 0x20, alpha: 1 }
const TRN = { r: 0, g: 0, b: 0, alpha: 0 }

// Pack PNG frames into a multi-size .ico (PNG-in-ICO, supported by all current browsers).
function buildIco(frames) {
  const head = Buffer.alloc(6)
  head.writeUInt16LE(0, 0)
  head.writeUInt16LE(1, 2)
  head.writeUInt16LE(frames.length, 4)
  const dir = Buffer.alloc(16 * frames.length)
  let offset = 6 + 16 * frames.length
  frames.forEach((f, i) => {
    const o = i * 16
    dir[o] = f.size >= 256 ? 0 : f.size
    dir[o + 1] = f.size >= 256 ? 0 : f.size
    dir.writeUInt16LE(1, o + 4)
    dir.writeUInt16LE(32, o + 6)
    dir.writeUInt32LE(f.data.length, o + 8)
    dir.writeUInt32LE(offset, o + 12)
    offset += f.data.length
  })
  return Buffer.concat([head, dir, ...frames.map((f) => f.data)])
}

async function chip(artwork, fill) {
  return sharp({ create: { width: 512, height: 512, channels: 4, background: BG } })
    .composite([{ input: await artwork(Math.round(512 * fill)), gravity: 'center' }])
    .png()
    .toBuffer()
}

// Variant A — the full emblem (hand, torch, bowl).
const emblem = (box) =>
  sharp(SRC)
    .extract({ left: 0, top: 10, width: 297, height: 278 })
    .resize({ width: box, height: box, fit: 'contain', background: TRN })
    .png()
    .toBuffer()

// Variant B — the flame alone, gold pixels isolated from the white hand behind it.
async function flame(box) {
  const W = 78, H = 127
  const { data } = await sharp(SRC)
    .extract({ left: 122, top: 8, width: W, height: H })
    .ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  for (let p = 0; p < W * H; p++) {
    const i = p * 4
    const goldness = Math.max(0, Math.min(1, (data[i] - data[i + 2] - 40) / 60))
    data[i + 3] = Math.round(data[i + 3] * goldness)
  }
  return sharp(data, { raw: { width: W, height: H, channels: 4 } })
    .resize({ height: box, fit: 'contain', background: TRN })
    .png().toBuffer()
}

;(async () => {
  for (const [name, artwork, fill] of [['emblem', emblem, 0.88], ['flame', flame, 0.8]]) {
    const master = await chip(artwork, fill)
    fs.writeFileSync(`${DIR}/${name}-512.png`, master)
    const frames = []
    for (const size of [16, 32, 48, 180, 192, 512]) {
      const data = await sharp(master).resize(size, size, { kernel: 'lanczos3' }).png().toBuffer()
      fs.writeFileSync(`${DIR}/${name}-${size}.png`, data)
      if ([16, 32, 48].includes(size)) frames.push({ size, data })
    }
    fs.writeFileSync(`${DIR}/${name}.ico`, buildIco(frames))
    console.log(name, 'ico bytes', fs.statSync(`${DIR}/${name}.ico`).size)
  }
})()

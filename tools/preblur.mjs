// Pre-blurs smoke/mist textures so the page needs no live CSS blur on large layers.
// sigma (in source pixels) = CSS blur px × (source width ÷ displayed width).
import sharp from 'sharp';
const T = 'src/assets/textures/';
const jobs = [
  // [source, output, sigma, output width]
  ['hero-mint-mist.png', 'hero-mint-mist-blur.webp', 3 * (2848 / 1504), 1600],
  ['hero-pile-smoke.png', 'hero-pile-smoke-blur.webp', 3 * (2848 / 1504), 1600],
  ['footer-smoke.png', 'footer-smoke-blur.webp', 3 * (2848 / 1504), 1600],
  ['panel-smoke-b.png', 'panel-smoke-b-app.webp', 4 * (1800 / 1464), 1464],
  ['panel-smoke-a.png', 'panel-smoke-a-soft.webp', 2 * (1800 / 680), 900],
  ['panel-smoke-b.png', 'panel-smoke-b-soft.webp', 2 * (1800 / 680), 900],
  ['panel-smoke-a.png', 'panel-smoke-a-silk.webp', 5 * (1800 / 628), 700],
  ['pro-smoke.png', 'pro-smoke-blur.webp', 4 * (2560 / 460), 520],
  ['panel-smoke-a.png', 'panel-smoke-a-mask.webp', 7 * (1800 / 1300), 1300],
];
for (const [src, out, sigma, w] of jobs) {
  const blurred = await sharp(T + src).blur(Math.max(0.3, sigma)).png().toBuffer();
  await sharp(blurred).resize({ width: w }).webp({ quality: 82, alphaQuality: 90 }).toFile(T + out);
  console.log(out, sigma.toFixed(1));
}

// Figma "Phone glow": 420×520 ellipse, #3FE3A6 at 22%, layer blur 90 (σ = 45).
// Colour stays solid; only the alpha is blurred (no dark fringe). Padding P covers the blur.
{
  const P = 160, W = 420 + 2 * P, H = 520 + 2 * P;
  const mask = Buffer.alloc(W * H);
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      // 4×4 supersampled ellipse coverage
      let c = 0;
      for (let sy = 0; sy < 4; sy++)
        for (let sx = 0; sx < 4; sx++) {
          const dx = (x + (sx + 0.5) / 4 - W / 2) / 210, dy = (y + (sy + 0.5) / 4 - H / 2) / 260;
          if (dx * dx + dy * dy <= 1) c++;
        }
      mask[y * W + x] = Math.round((c / 16) * 255);
    }
  const blurred = await sharp(mask, { raw: { width: W, height: H, channels: 1 } }).blur(45).extractChannel(0).raw().toBuffer();
  const alpha = Buffer.from(blurred.map((v) => Math.round(v * 0.22)));
  await sharp({ create: { width: W, height: H, channels: 3, background: '#3fe3a6' } })
    .joinChannel(alpha, { raw: { width: W, height: H, channels: 1 } })
    .webp({ quality: 90, alphaQuality: 100 })
    .toFile(T + 'hero-phone-glow.webp');
  console.log('hero-phone-glow.webp', W, H);
}

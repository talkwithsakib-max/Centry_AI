# CentryAI footer — ghost smoke

The misty mint/sky smoke behind the giant "CentryAI" wordmark in the footer of the **Home 2** frame
(Figma file "Sakib", layer `Footer › Footer card › Ghost smoke (texture)`).

## Files

| File | What it is |
|---|---|
| `smoke_footer.png` | Final texture used in Figma, 2848×1540 (2× the 1424×770 footer card), transparent background |
| `smoke_preview.png` | The same smoke flattened on white, for a quick look |
| `smoke.swift` | The generator: domain-warped fractal noise, coloured mint / sky / cool grey, fading out toward the top |

## Regenerate

```bash
swiftc -O smoke.swift -o smoke
./smoke smoke_footer.png 2848 1540 7
```

Arguments: `output.png width height seed`. The footer uses **seed 7**; any other seed gives a different
but matching smoke. Render at 2× the size it will be shown at.

Tweaks inside `smoke.swift`:

- `smoothstep(0.37, 0.76, f)` — smoke density (lower the first number for more smoke)
- `smoothstep(0.18, 0.9, ny)` — where the smoke starts fading toward the top
- `dens * 0.82` — overall opacity
- `mintC`, `skyC`, `greyC` — colours

In Figma the texture layer also has a 6px layer blur and is oversized by 40px on each side, so the blur's
soft edges fall outside the card.

## Using it on the website

Place the PNG behind the footer content and let it drift slowly:

```css
.footer { position: relative; overflow: hidden; }
.footer-smoke {
  position: absolute; inset: -40px;
  background: url("smoke_footer.png") center bottom / cover no-repeat;
  filter: blur(6px);
  pointer-events: none;
  animation: smoke-drift 40s ease-in-out infinite alternate;
}
@keyframes smoke-drift {
  from { transform: translateX(-2%) scale(1.04); }
  to   { transform: translateX(2%)  scale(1.08); }
}
@media (prefers-reduced-motion: reduce) {
  .footer-smoke { animation: none; }
}
```

For smoke that actually moves and curls, port the noise in `smoke.swift` (the `fbm` and domain-warp
lines) to a WebGL fragment shader and add time to the noise coordinates.

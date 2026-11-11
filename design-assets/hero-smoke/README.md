# CentryAI hero — ghost smoke + mint mist

The two smoke layers in the hero of the **Home 2** frame (Figma file "Sakib").

| File | Figma layer | Settings in Figma |
|---|---|---|
| `hero_top_mist.png` | `Hero › Mint mist (replaces clouds)` | 40% opacity, 6px layer blur, oversized 40px on each side |
| `hero_pile_smoke.png` | `Hero visual (Gaia pile) › Ghost smoke (behind pile)` | 85% opacity, 6px layer blur, behind the cancelled pile |

There is also a vector layer, `Ghost wisps (front of pile)`: 5 blurred white and mint strokes drifting over
the top row of cancelled tiles.

Both textures are 2848×2016 (2× the 1424×1008 hero card), transparent background.

## Regenerate

```bash
swiftc -O smoke2.swift -o smoke2
./smoke2 hero_pile_smoke.png 2848 2016 11 bottom ghost
./smoke2 hero_top_mist.png   2848 2016 3  top    mint
```

Arguments: `output.png width height seed mode palette`

- `mode`: `bottom` puts the dense smoke at the bottom and fades it upward; `top` does the reverse.
- `palette`: `ghost` is greyer; `mint` is the mint / sky mix.

`smoke2.swift` is the footer generator (`../footer-smoke/smoke.swift`) with these two options added. See the
footer README for the density, fade and colour tweaks, and for the CSS drift animation.

## Zombie Alert smoke (option frames)

`zombie_alert_smoke.png`: `./smoke2 zombie_alert_smoke.png 2880 1480 13 bottom ghost`. Used twice in the option frames: once at 100%, and once mirrored and taller at 70%.

## Zombie Alert card smoke (final)

`zombie_card_smoke_a.png` (seed 7) and `zombie_card_smoke_b.png` (seed 21, mirrored, 70%). Generated with `./smoke2 <out> 2560 1320 <seed> bottom pure`. The `pure` palette mixes in very little grey, so the smoke stays mint on warm backgrounds. Figma settings: 6px and 8px layer blur.

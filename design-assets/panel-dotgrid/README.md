# CentryAI — dark Features panel dot grid

`panel_dotgrid.png` (1432×624, 2× a 716×312 panel) is the `Dot grid` layer in each Visual panel of
**Home 2 — Dark › Features (bento)**. White dots every 14px (28px at 2×), 16% opacity in the centre,
fading out radially toward the edges.

```bash
swiftc -O dotgrid.swift -o dotgrid
./dotgrid panel_dotgrid.png 1432 624 28 0.16   # out W H spacing alpha
```

Panel stack (bottom → top): Silk (mint glow 14%, sky glow 6%, Spotlight 7%) → Dot grid → Vignette → content.
The old smoke, cream glow and sheen are still there, hidden.

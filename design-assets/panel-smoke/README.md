# CentryAI — subtle panel smoke

Soft, even smoke layered over the gradient ("pearl mint silk") panels across Home 2.

| File | Used in |
|---|---|
| `panel_smoke_a.png` | Features bento panels, How it works open-card panels, App preview background (alternating with b) |
| `panel_smoke_b.png` | Same, alternating with a |

Figma settings: a layer named `Subtle smoke` above each panel's `Silk` layer, 40% opacity (28% on the
App preview background), 4px layer blur, oversized 20px on each side.

Regenerate with `../hero-smoke/smoke2.swift` and the `even` mode, which fades softly at all four edges:

```bash
swiftc -O ../hero-smoke/smoke2.swift -o smoke2
./smoke2 panel_smoke_a.png 1800 800 5 even mint
./smoke2 panel_smoke_b.png 1800 800 9 even mint
```

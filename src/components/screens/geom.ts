/**
 * Figma exports small vectors as "Group" boxes inset inside an icon frame, with
 * the SVG bleeding past the group by a padding. This turns those two percentage
 * insets into a single absolute style for an <img> inside a `box`×`box` frame.
 *   inset: group inset [top, right, bottom, left] in % of the frame
 *   pad:   svg bleed [top, right, bottom, left] in % of the group (negative = bleed)
 */
type Q = [number, number, number, number];
export function vecStyle(box: number | [number, number], inset: Q, pad: Q = [0, 0, 0, 0]) {
  const [W, H] = Array.isArray(box) ? box : [box, box];
  const gx = (inset[3] / 100) * W;
  const gy = (inset[0] / 100) * H;
  const gw = W * (1 - (inset[1] + inset[3]) / 100);
  const gh = H * (1 - (inset[0] + inset[2]) / 100);
  const x = gx + (pad[3] / 100) * gw;
  const y = gy + (pad[0] / 100) * gh;
  const w = gw * (1 - (pad[1] + pad[3]) / 100);
  const h = gh * (1 - (pad[0] + pad[2]) / 100);
  const r = (n: number) => +n.toFixed(3);
  return `left:${r(x)}px;top:${r(y)}px;width:${r(w)}px;height:${r(h)}px`;
}

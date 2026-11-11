// Ghost hand made of smoke: the hand silhouette is softened, displaced by noise so its edges fray,
// filled with swirling fBm smoke, and given a smoke trail streaming from the wrist.
// usage: ghosthand out.png seed
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let seed = UInt64(a[2])!
let W = 640, H = 1280, S = 2.0, OX = 150.0, OY = 60.0

// hand outline (viewBox 170x480, fingers up), absolute M/C/Z only
let HAND = "M62 480 C66 420 70 360 72 305 C64 292 56 276 50 262 C38 250 24 236 14 216 C9 206 18 198 27 205 C38 214 48 224 56 232 C54 214 52 196 52 182 C48 150 44 118 42 92 C41 80 46 72 54 74 C60 76 62 86 63 98 C65 124 70 152 76 172 C76 140 76 104 78 74 C79 62 86 56 93 58 C100 60 102 70 102 82 C102 112 101 144 100 168 C104 142 108 110 114 86 C117 75 125 72 131 77 C136 82 134 92 132 102 C127 126 122 150 120 172 C126 154 134 134 142 120 C147 111 155 112 157 120 C159 128 155 138 151 148 C144 166 140 184 140 204 C142 236 136 270 128 300 C130 360 134 420 138 480 Z"

func parsePath(_ d: String) -> CGPath {
    let p = CGMutablePath()
    var tok: [String] = []
    var cur = ""
    for ch in d {
        if ch.isLetter { if !cur.isEmpty { tok.append(cur); cur = "" }; tok.append(String(ch)) }
        else if ch == " " || ch == "," { if !cur.isEmpty { tok.append(cur); cur = "" } }
        else { cur.append(ch) }
    }
    if !cur.isEmpty { tok.append(cur) }
    var i = 0
    func n() -> CGFloat { let v = CGFloat(Double(tok[i])!); i += 1; return v }
    func pt() -> CGPoint { let x = n(), y = n(); return CGPoint(x: OX + Double(x) * S, y: OY + Double(y) * S) }
    while i < tok.count {
        let c = tok[i]; i += 1
        switch c {
        case "M": p.move(to: pt())
        case "C": while i < tok.count, Double(tok[i]) != nil { let c1 = pt(), c2 = pt(), e = pt(); p.addCurve(to: e, control1: c1, control2: c2) }
        case "Z": p.closeSubpath()
        default: break
        }
    }
    return p
}

// rasterise the silhouette (y down)
var mask = [Double](repeating: 0, count: W * H)
do {
    var g = [UInt8](repeating: 0, count: W * H)
    g.withUnsafeMutableBytes { b in
        let c = CGContext(data: b.baseAddress, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W,
                          space: CGColorSpaceCreateDeviceGray(), bitmapInfo: CGImageAlphaInfo.none.rawValue)!
        c.translateBy(x: 0, y: CGFloat(H)); c.scaleBy(x: 1, y: -1)
        c.setFillColor(gray: 1, alpha: 1); c.addPath(parsePath(HAND)); c.fillPath()
    }
    for i in 0..<(W * H) { mask[i] = Double(g[i]) / 255 }
}
// soften: 3 box-blur passes
func boxBlur(_ src: [Double], _ r: Int) -> [Double] {
    var tmp = src, out = src
    for y in 0..<H { var acc = 0.0; for x in -r...r { acc += src[y * W + max(0, min(W - 1, x))] }
        for x in 0..<W { tmp[y * W + x] = acc / Double(2 * r + 1); acc += src[y * W + min(W - 1, x + r + 1)] - src[y * W + max(0, x - r)] } }
    for x in 0..<W { var acc = 0.0; for y in -r...r { acc += tmp[max(0, min(H - 1, y)) * W + x] }
        for y in 0..<H { out[y * W + x] = acc / Double(2 * r + 1); acc += tmp[min(H - 1, y + r + 1) * W + x] - tmp[max(0, y - r) * W + x] } }
    return out
}
for _ in 0..<3 { mask = boxBlur(mask, 5) }
func sampleMask(_ x: Double, _ y: Double) -> Double {
    let x0 = Int(floor(x)), y0 = Int(floor(y)); if x0 < 0 || y0 < 0 || x0 >= W - 1 || y0 >= H - 1 { return 0 }
    let tx = x - Double(x0), ty = y - Double(y0)
    let a = mask[y0 * W + x0], b = mask[y0 * W + x0 + 1], c = mask[(y0 + 1) * W + x0], d = mask[(y0 + 1) * W + x0 + 1]
    return (a * (1 - tx) + b * tx) * (1 - ty) + (c * (1 - tx) + d * tx) * ty
}

// noise
var perm = [Int](0..<256); var s = seed
for i in stride(from: 255, to: 0, by: -1) { s = s &* 6364136223846793005 &+ 1442695040888963407; perm.swapAt(i, Int(s >> 33) % (i + 1)) }
perm += perm
@inline(__always) func fade(_ t: Double) -> Double { t * t * t * (t * (t * 6 - 15) + 10) }
@inline(__always) func grad(_ h: Int, _ x: Double, _ y: Double) -> Double {
    switch h & 7 { case 0: return x + y; case 1: return -x + y; case 2: return x - y; case 3: return -x - y
    case 4: return x; case 5: return -x; case 6: return y; default: return -y } }
func noise(_ x: Double, _ y: Double) -> Double {
    let xi = Int(floor(x)) & 255, yi = Int(floor(y)) & 255, xf = x - floor(x), yf = y - floor(y), u = fade(xf), v = fade(yf)
    let aa = perm[perm[xi] + yi], ab = perm[perm[xi] + yi + 1], ba = perm[perm[xi + 1] + yi], bb = perm[perm[xi + 1] + yi + 1]
    let x1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf))
    let x2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1))
    return (x1 + v * (x2 - x1)) * 0.5 + 0.5 }
func fbm(_ x: Double, _ y: Double) -> Double { var f = 0.0, amp = 0.5, px = x, py = y
    for _ in 0..<5 { f += amp * noise(px, py); px = px * 2.03 + 11.7; py = py * 2.03 + 5.3; amp *= 0.5 }; return f }
func smoothstep(_ e0: Double, _ e1: Double, _ x: Double) -> Double { let t = max(0, min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) }
func mix(_ a: Double, _ b: Double, _ t: Double) -> Double { a + (b - a) * t }

let wristY = OY + 330 * S          // where the hand turns into a trail
let teal = (34.0, 168.0, 140.0), mint = (120.0, 236.0, 200.0), white = (240.0, 255.0, 250.0)
var px = [UInt8](repeating: 0, count: W * H * 4)
for y in 0..<H {
    for x in 0..<W {
        let fx = Double(x), fy = Double(y)
        let sc = 0.011
        let qx = fbm(fx * sc, fy * sc), qy = fbm(fx * sc + 5.2, fy * sc + 1.3)
        // displacement grows toward the wrist and below it, so the arm dissolves into wisps
        let down = smoothstep(OY + 120, wristY + 260, fy)
        let amp = 14 + 70 * down
        let dx = (qx - 0.5) * amp * 2 + down * 26 * sin(fy * 0.012), dy = (qy - 0.5) * amp * 1.4 + down * 30
        var m = sampleMask(fx + dx, fy - dy)
        // fingertip fray
        m *= 0.75 + 0.5 * fbm(fx * 0.03, fy * 0.03)
        // trail below the wrist
        let trail = smoothstep(wristY - 60, wristY + 120, fy) * (1 - smoothstep(Double(H) - 220, Double(H), fy))
        let tc = OX + 100 * S + 60 * sin(fy * 0.006 + 1) + (qx - 0.5) * 160
        let tw = 46 + 0.07 * (fy - wristY)
        let tm = trail * exp(-pow((fx - tc) / max(1, tw), 2)) * pow(1 - abs(2 * fbm(fx * 0.03 + 3 + 2 * qx, fy * 0.005) - 1), 3) * 1.6
        let dens0 = max(m, tm * 0.85)
        let swirl = fbm(fx * 0.018 + 4 * qx, fy * 0.018 + 4 * qy)
        // ridged noise gives thin, bright smoke strands; the edge term keeps the outline readable
        let rn = fbm(fx * 0.028 + 2.5 * qx, fy * 0.007 + 2.5 * qy)
        let ridge = pow(1 - abs(2 * rn - 1), 6)
        let edge = smoothstep(0.08, 0.35, dens0) * (1 - smoothstep(0.55, 0.95, dens0))
        var dens = dens0 * (0.1 + 1.15 * ridge) + edge * 0.55 * (0.4 + swirl)
        dens *= 1 - 0.65 * smoothstep(wristY, Double(H) - 80, fy)
        let alpha = min(0.9, max(0, dens * 1.05))
        if alpha <= 0.003 { continue }
        let t1 = smoothstep(0.35, 0.75, swirl), t2 = smoothstep(0.35, 0.9, ridge) * 0.75
        var r = mix(teal.0, mint.0, t1), g = mix(teal.1, mint.1, t1), b = mix(teal.2, mint.2, t1)
        r = mix(r, white.0, t2); g = mix(g, white.1, t2); b = mix(b, white.2, t2)
        let i = (y * W + x) * 4
        px[i] = UInt8(r * alpha); px[i + 1] = UInt8(g * alpha); px[i + 2] = UInt8(b * alpha); px[i + 3] = UInt8(alpha * 255)
    }
}
px.withUnsafeMutableBytes { p in
    let c = CGContext(data: p.baseAddress, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4,
                      space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    let d = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(d, c.makeImage()!, nil); CGImageDestinationFinalize(d)
}
print("ok")

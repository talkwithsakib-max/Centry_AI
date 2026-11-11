// Procedural ghost smoke: domain-warped fBm noise, colourised mint/sky/grey, fading upward.
// usage: smoke out.png width height seed
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers

let a = CommandLine.arguments
let W = Int(a[2])!, H = Int(a[3])!, seed = UInt64(a[4])!

// permutation table for gradient noise
var perm = [Int](0..<256)
var s = seed
for i in stride(from: 255, to: 0, by: -1) { s = s &* 6364136223846793005 &+ 1442695040888963407; let j = Int(s >> 33) % (i + 1); perm.swapAt(i, j) }
perm += perm
@inline(__always) func fade(_ t: Double) -> Double { t * t * t * (t * (t * 6 - 15) + 10) }
@inline(__always) func grad(_ h: Int, _ x: Double, _ y: Double) -> Double {
    switch h & 7 { case 0: return x + y; case 1: return -x + y; case 2: return x - y; case 3: return -x - y
    case 4: return x; case 5: return -x; case 6: return y; default: return -y }
}
func noise(_ x: Double, _ y: Double) -> Double {
    let xi = Int(floor(x)) & 255, yi = Int(floor(y)) & 255
    let xf = x - floor(x), yf = y - floor(y), u = fade(xf), v = fade(yf)
    let aa = perm[perm[xi] + yi], ab = perm[perm[xi] + yi + 1], ba = perm[perm[xi + 1] + yi], bb = perm[perm[xi + 1] + yi + 1]
    let x1 = grad(aa, xf, yf) + u * (grad(ba, xf - 1, yf) - grad(aa, xf, yf))
    let x2 = grad(ab, xf, yf - 1) + u * (grad(bb, xf - 1, yf - 1) - grad(ab, xf, yf - 1))
    return (x1 + v * (x2 - x1)) * 0.5 + 0.5   // 0..1
}
func fbm(_ x: Double, _ y: Double) -> Double {
    var f = 0.0, amp = 0.5, px = x, py = y
    for _ in 0..<5 { f += amp * noise(px, py); px = px * 2.02 + 17.3; py = py * 2.02 + 9.1; amp *= 0.5 }
    return f
}
func smoothstep(_ e0: Double, _ e1: Double, _ x: Double) -> Double { let t = max(0, min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t) }
func mix(_ a: Double, _ b: Double, _ t: Double) -> Double { a + (b - a) * t }

let mintC = (63.0, 227.0, 166.0), skyC = (124.0, 200.0, 240.0), greyC = (184.0, 196.0, 206.0), whiteC = (255.0, 255.0, 255.0)
var px = [UInt8](repeating: 0, count: W * H * 4)
let sc = 3.2 / Double(W)   // noise scale (horizontal)
for y in 0..<H {
    for x in 0..<W {
        // stretch horizontally so the smoke drifts sideways; slight upward lean
        let p = (Double(x) * sc * 0.75, Double(y) * sc * 1.25)
        let q = (fbm(p.0, p.1), fbm(p.0 + 5.2, p.1 + 1.3))
        let r = (fbm(p.0 + 3.8 * q.0 + 1.7, p.1 + 3.8 * q.1 + 9.2), fbm(p.0 + 3.8 * q.0 + 8.3, p.1 + 3.8 * q.1 + 2.8))
        let f = fbm(p.0 + 3.6 * r.0, p.1 + 3.6 * r.1)
        let ny = Double(y) / Double(H)
        let vertical = smoothstep(0.18, 0.9, ny)                 // nothing at the top, dense at the bottom
        var dens = smoothstep(0.37, 0.76, f) * vertical
        dens = pow(dens, 1.15)
        // colour: mint ↔ sky by r, toward grey by q, highlights to white where dense
        let t1 = smoothstep(0.35, 0.7, r.0), t2 = smoothstep(0.4, 0.75, q.1) * 0.55, t3 = smoothstep(0.62, 0.95, f) * 0.22
        var cr = mix(mintC.0, skyC.0, t1), cg = mix(mintC.1, skyC.1, t1), cb = mix(mintC.2, skyC.2, t1)
        cr = mix(cr, greyC.0, t2); cg = mix(cg, greyC.1, t2); cb = mix(cb, greyC.2, t2)
        cr = mix(cr, whiteC.0, t3); cg = mix(cg, whiteC.1, t3); cb = mix(cb, whiteC.2, t3)
        let alpha = min(1, dens * 0.82)
        let i = (y * W + x) * 4
        px[i] = UInt8(cr * alpha); px[i + 1] = UInt8(cg * alpha); px[i + 2] = UInt8(cb * alpha); px[i + 3] = UInt8(alpha * 255)
    }
}
px.withUnsafeMutableBytes { p in
    let c = CGContext(data: p.baseAddress, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W * 4, space: CGColorSpaceCreateDeviceRGB(),
                      bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
    let d = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
    CGImageDestinationAddImage(d, c.makeImage()!, nil); CGImageDestinationFinalize(d)
}
print("ok")

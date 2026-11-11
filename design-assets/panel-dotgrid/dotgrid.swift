// Fine dot grid with a soft radial fade, for the dark Features panels.
// usage: dotgrid out.png W H spacing alpha
import Foundation
import CoreGraphics
import ImageIO
import UniformTypeIdentifiers
let a = CommandLine.arguments
let W = Int(a[2])!, H = Int(a[3])!, sp = Double(a[4])!, al = Double(a[5])!
let c = CGContext(data: nil, width: W, height: H, bitsPerComponent: 8, bytesPerRow: W*4, space: CGColorSpaceCreateDeviceRGB(), bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue)!
let cx = Double(W)/2, cy = Double(H)*0.55
var y = sp/2
while y < Double(H) {
  var x = sp/2
  while x < Double(W) {
    let dx = (x-cx)/(Double(W)*0.55), dy = (y-cy)/(Double(H)*0.62)
    let d = sqrt(dx*dx+dy*dy)
    let f = max(0, 1 - d); let k = f*f*(3-2*f)
    if k > 0.01 {
      c.setFillColor(red: 1, green: 1, blue: 1, alpha: al*k)
      c.fillEllipse(in: CGRect(x: x-1.3, y: y-1.3, width: 2.6, height: 2.6))
    }
    x += sp
  }
  y += sp
}
let d = CGImageDestinationCreateWithURL(URL(fileURLWithPath: a[1]) as CFURL, UTType.png.identifier as CFString, 1, nil)!
CGImageDestinationAddImage(d, c.makeImage()!, nil); CGImageDestinationFinalize(d)
print("ok")

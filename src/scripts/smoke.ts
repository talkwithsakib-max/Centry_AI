/**
 * Animated smoke (WebGL) for the hero, footer and Privacy card.
 * 2026-11-09: hero approved; then user asked for smoke that RISES and DRIFTS like
 * real smoke in the hero, footer and Privacy.
 *
 * Each <canvas data-smoke data-src> redraws the same smoke texture its still layer
 * uses. Motion = flow-map advection: the texture is pulled upward (with a slowly
 * wandering sideways lean) by two copies half a cycle apart that cross-fade, so
 * wisps keep rising forever while the overall composition stays the Figma one.
 * A light domain warp curls the wisps, and a soft density noise thins them.
 *
 * Canvas options:
 *   data-box="w,h"   design box drawn with object-fit: cover, centred; extra canvas
 *                    width shows it mirrored (hero wide-screen bleed)
 *   data-fit="fill"  texture stretched over the whole canvas (CSS mask-size = box)
 *   (neither)        object-fit: cover over the canvas itself
 *   data-tint="dark" always tinted as Figma "Dark smoke"; default follows the theme
 * The still layers stay as first paint and fallback: the canvases' [data-smoke-root]
 * gets .smoke-gl-on once they draw. Motion eases in from zero so the hand-over is
 * seamless. No WebGL or reduced motion → the still smoke stays.
 * Half resolution, ~30fps, paused off-screen.
 */

const VERT = `
attribute vec2 p;
varying vec2 v;
void main() {
  v = p * 0.5 + 0.5;
  gl_Position = vec4(p, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
varying vec2 v;
uniform sampler2D uTex;
uniform float uTime;   // seconds
uniform float uEase;   // 0 → 1 over the first seconds
uniform float uDark;
uniform vec2 uScale;
uniform vec2 uOffset;
uniform vec2 uBox;     // design box inside the canvas: x = left edge, y = width (fractions)
uniform float uRise;   // texture heights a wisp travels per cycle
uniform float uRate;   // cycles per second
uniform float uCurl;   // in-place curl strength
uniform float uDens;   // how much wisps thin / thicken

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) { s += a * noise(p); p *= 2.03; a *= 0.5; }
  return s;
}


vec4 smoke(vec2 uv, float t) {
  // curl: noise of noise, drifting upward over time
  vec2 q = vec2(fbm(uv * 2.6 + vec2(0.0, t * 0.09)), fbm(uv * 2.6 + vec2(5.2, 1.3 + t * 0.08)));
  vec2 w = (vec2(fbm(uv * 2.6 + 3.0 * q + vec2(1.7, 9.2)), fbm(uv * 2.6 + 3.0 * q + vec2(8.3, 2.8))) - 0.5) * uCurl;
  return texture2D(uTex, clamp(uv + w * uEase, 0.0, 1.0));
}

void main() {
  // position inside the design box; beyond it (wide-screen bleed) mirrored
  float bx = (v.x - uBox.x) / uBox.y;
  bx = bx < 0.0 ? -bx : (bx > 1.0 ? 2.0 - bx : bx);
  vec2 uv = vec2(bx, 1.0 - v.y) * uScale + uOffset; // texture space, y down
  float t = uTime;

  // flow direction: up (texture -y) leaning left/right with slow noise
  float lean = (fbm(uv * 1.6 + vec2(t * 0.03, 0.0)) - 0.47) * 2.4;
  vec2 dir = vec2(sin(lean), cos(lean)); // sampled from below → content moves up

  float ph0 = fract(t * uRate);
  float ph1 = fract(t * uRate + 0.5);
  float d = uRise * uEase;
  vec4 c0 = smoke(uv + dir * ph0 * d, t);
  vec4 c1 = smoke(uv + dir * ph1 * d, t);
  float k = abs(1.0 - 2.0 * ph0); // c0 fades out as it resets
  vec4 c = mix(c0, c1, k);

  // wisps thin and thicken as they travel (mean ≈ 1, keeps the Figma density)
  float dens = 1.0 + (fbm(uv * 3.2 + vec2(0.0, t * 0.12)) - 0.47) * uDens * uEase;
  c *= clamp(dens, 0.0, 1.4);
  c.a = min(c.a, 1.0);

  if (uDark > 0.5) {
    vec3 a = vec3(0.200, 0.271, 0.259); // #334542
    vec3 b = vec3(0.161, 0.220, 0.220); // #293838
    vec3 e = vec3(0.200, 0.251, 0.278); // #334047
    vec3 g = bx < 0.5 ? mix(a, b, bx * 2.0) : mix(b, e, bx * 2.0 - 1.0);
    gl_FragColor = vec4(g * c.a, c.a);
  } else {
    gl_FragColor = vec4(min(c.rgb, vec3(c.a)), c.a); // premultiplied
  }
}`;

const EASE_IN = 2.5; // s for the motion to grow from 0 (seamless hand-over)
const FRAME_MS = 1000 / 30;
const RES = 0.5; // render scale (blurry smoke needs few pixels)
const MAX_W = 1280;

interface Layer {
  canvas: HTMLCanvasElement;
  root: HTMLElement;
  gl: WebGLRenderingContext;
  u: Record<string, WebGLUniformLocation | null>;
  tw: number;
  th: number;
  ready: boolean;
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) || 'shader');
  return s;
}

function setup(canvas: HTMLCanvasElement, root: HTMLElement, img: HTMLImageElement): Layer | null {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false });
  if (!gl) return null;
  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const u: Layer['u'] = {};
  for (const n of ['uTex', 'uTime', 'uEase', 'uDark', 'uScale', 'uOffset', 'uBox', 'uRise', 'uRate', 'uCurl', 'uDens'])
    u[n] = gl.getUniformLocation(prog, n);
  gl.uniform1i(u.uTex, 0);
  // motion strength: defaults = hero/footer/Privacy
  // data-motion="calm": App preview (user: "normal and smooth") — a touch more
  // drift than the default, but slower, so it glides rather than churns
  const calm = canvas.dataset.motion === 'calm';
  gl.uniform1f(u.uRise, calm ? 0.16 : 0.11);
  gl.uniform1f(u.uRate, calm ? 0.08 : 0.12);
  gl.uniform1f(u.uCurl, calm ? 0.04 : 0.035);
  gl.uniform1f(u.uDens, calm ? 0.4 : 0.45);
  return { canvas, root, gl, u, tw: img.naturalWidth, th: img.naturalHeight, ready: false };
}

function resize(l: Layer) {
  const { canvas, gl } = l;
  const rect = canvas.getBoundingClientRect(); // on-screen size (after any scaling)
  if (!rect.width || !rect.height) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let w = Math.max(2, Math.round(rect.width * dpr * RES));
  let h = Math.max(2, Math.round(rect.height * dpr * RES));
  if (w > MAX_W) {
    h = Math.round((h * MAX_W) / w);
    w = MAX_W;
  }
  if (canvas.width !== w || canvas.height !== h) {
    canvas.width = w;
    canvas.height = h;
  }
  gl.viewport(0, 0, w, h);

  const cw = Math.max(1, canvas.offsetWidth);
  const ch = Math.max(1, canvas.offsetHeight);
  if (canvas.dataset.fit === 'fill') {
    gl.uniform2f(l.u.uBox, 0, 1);
    gl.uniform2f(l.u.uScale, 1, 1);
    gl.uniform2f(l.u.uOffset, 0, 0);
    return;
  }
  // cover-fit the texture into the design box (or the canvas itself)
  const [bw, bh] = canvas.dataset.box ? canvas.dataset.box.split(',').map(Number) : [cw, ch];
  const boxW = Math.min(1, bw / cw);
  gl.uniform2f(l.u.uBox, (1 - boxW) / 2, boxW);
  const ae = bw / bh;
  const at = l.tw / l.th;
  if (ae > at) {
    gl.uniform2f(l.u.uScale, 1, at / ae);
    gl.uniform2f(l.u.uOffset, 0, (1 - at / ae) / 2);
  } else {
    gl.uniform2f(l.u.uScale, ae / at, 1);
    gl.uniform2f(l.u.uOffset, (1 - ae / at) / 2, 0);
  }
}

const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

export function initSmoke() {
  const canvases = [...document.querySelectorAll<HTMLCanvasElement>('canvas[data-smoke]')];
  if (!canvases.length) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const layers: Layer[] = [];
  const visible = new Map<HTMLElement, boolean>();
  const rootStart = new Map<HTMLElement, number>(); // motion eases in per section
  let last = 0;
  let running = false;

  const render = (l: Layer, now: number) => {
    let t0 = rootStart.get(l.root);
    if (t0 === undefined) rootStart.set(l.root, (t0 = now));
    const secs = (now - t0) / 1000;
    const e = Math.min(1, secs / EASE_IN);
    const { gl, u } = l;
    gl.uniform1f(u.uTime, secs);
    gl.uniform1f(u.uEase, e * e * (3 - 2 * e)); // smoothstep
    gl.uniform1f(u.uDark, l.canvas.dataset.tint === 'dark' || isDark() ? 1 : 0);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const draw = (now: number) => {
    requestAnimationFrame(draw);
    if (now - last < FRAME_MS) return;
    last = now;
    for (const l of layers) {
      if (!visible.get(l.root)) continue;
      if (!l.ready) {
        // hand over from the still layers once every canvas of this section is loaded
        const mine = layers.filter((x) => x.root === l.root);
        const total = canvases.filter((c) => c.closest('[data-smoke-root]') === l.root).length;
        if (mine.length < total) continue;
        l.root.classList.add('smoke-gl-on');
        mine.forEach((x) => {
          x.ready = true;
          resize(x); // laid out now
          render(x, now);
        });
        continue;
      }
      render(l, now);
    }
  };

  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => visible.set(en.target as HTMLElement, en.isIntersecting)),
    { rootMargin: '100px' },
  );

  for (const canvas of canvases) {
    const root = canvas.closest<HTMLElement>('[data-smoke-root]');
    if (!root) continue;
    if (!visible.has(root)) {
      visible.set(root, false);
      io.observe(root);
    }
    const img = new Image();
    img.decoding = 'async';
    img.src = canvas.dataset.src!;
    img
      .decode()
      .then(() => {
        const l = setup(canvas, root, img);
        if (!l) return;
        layers.push(l);
        resize(l);
        if (!running) {
          running = true;
          requestAnimationFrame(draw);
        }
      })
      .catch(() => {
        /* no image / shader support: the still smoke stays */
      });
  }

  const onResize = () => layers.forEach(resize);
  window.addEventListener('resize', onResize, { passive: true });
  const ro = new ResizeObserver(onResize);
  canvases.forEach((c) => ro.observe(c));
}

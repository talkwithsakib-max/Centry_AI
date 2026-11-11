// Downloads Figma MCP asset URLs into src/assets. Usage: node tools/fetch-assets.mjs map.json
// map.json: { "relative/path/in/src/assets.svg": "https://www.figma.com/api/mcp/asset/..." }
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
const map = JSON.parse(await readFile(process.argv[2], 'utf8'));
let ok = 0;
for (const [rel, url] of Object.entries(map)) {
  const out = join('src/assets', rel);
  const res = await fetch(url);
  if (!res.ok) { console.error('FAIL', res.status, rel); continue; }
  const buf = Buffer.from(await res.arrayBuffer());
  if (!buf.length) { console.error('EMPTY', rel); continue; }
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buf);
  ok++;
}
console.log(`downloaded ${ok}/${Object.keys(map).length}`);

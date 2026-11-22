// Banned-terms gate (§12.1). Reads its terms from banned-terms.txt in the repo root;
// this file contains no terms. Run locally after `npm run build`, before every push.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const termsFile = join(root, 'banned-terms.txt');
const dist = join(root, 'dist');

if (!existsSync(termsFile)) {
  console.warn('check:copy: banned-terms.txt not found, skipping. Run this locally before pushing.');
  process.exit(0);
}
if (!existsSync(dist)) {
  console.error('check:copy: dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const rules = readFileSync(termsFile, 'utf8')
  .split(/\r?\n/)
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith('#'))
  .map((line) => {
    const m = line.match(/^\/(.+)\/$/);
    // "/pattern/" is a case-sensitive regex; anything else is a case-insensitive literal.
    return { line, re: m ? new RegExp(m[1], 'g') : new RegExp(escape(line), 'gi') };
  });

// Hosting provider name: allowed only inside the analytics beacon host.
const beaconHost = /static\.cloudflareinsights\.com/gi;
const hostRule = { line: '(hosting provider name outside the beacon URL)', re: /cloudflare/gi, strip: beaconHost };

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(html|xml|txt)$/i.test(name)) yield p;
  }
}

let failures = 0;
let files = 0;
for (const file of walk(dist)) {
  files++;
  const text = readFileSync(file, 'utf8');
  for (const rule of [...rules, hostRule]) {
    const haystack = rule.strip ? text.replace(rule.strip, '') : text;
    for (const m of haystack.matchAll(rule.re)) {
      failures++;
      const at = Math.max(0, m.index - 40);
      const context = haystack.slice(at, m.index + m[0].length + 40).replace(/\s+/g, ' ');
      console.error(`✗ ${relative(root, file)}: rule ${rule.line}\n    …${context}…`);
    }
  }
}

if (failures) {
  console.error(`\ncheck:copy: ${failures} match(es) in ${files} file(s).`);
  process.exit(1);
}
console.log(`check:copy: ${files} file(s) clean against ${rules.length + 1} rules.`);

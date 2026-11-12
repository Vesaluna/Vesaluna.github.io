import { cpSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = join(root, 'public');
const destination = join(root, 'public-neocities');
const mainOrigin = 'https://vesaluna.com';
const mirrorOrigin = 'https://vesaluna.neocities.org';

for (const route of ['index.html', 'en/index.html', 'it/index.html', 'search.xml']) {
  if (!existsSync(join(source, route))) throw new Error(`Build the blog first: missing ${route}`);
}

// Only the dedicated, ignored build output is replaced.
rmSync(destination, { recursive: true, force: true });
cpSync(source, destination, { recursive: true });
for (const file of ['CNAME', '.nojekyll']) rmSync(join(destination, file), { force: true });

let count = 0;
function visit(folder) {
  for (const entry of readdirSync(folder, { withFileTypes: true })) {
    const file = join(folder, entry.name);
    if (entry.isDirectory()) { visit(file); continue; }
    if (!['.html', '.xml', '.json', '.js', '.css', '.txt'].includes(extname(file))) continue;
    const original = readFileSync(file, 'utf8');
    let mirrored = original.replace(/https:\/\/vesaluna\.com(?=[/"'\s<]|$)/g, mirrorOrigin);
    // The mirror is usable independently; the original remains the canonical copy.
    if (extname(file) === '.html') {
      mirrored = mirrored.replace(/<link\b[^>]*\brel=["']canonical["'][^>]*>/gi,
        tag => tag.replace(mirrorOrigin, mainOrigin));
    }
    if (original !== mirrored) writeFileSync(file, mirrored);
    count++;
  }
}
visit(destination);

for (const prefix of ['', 'en/', 'it/']) {
  const home = readFileSync(join(destination, prefix, 'index.html'), 'utf8');
  if (!home.includes(`href="${mainOrigin}/${prefix}"`) || !home.includes(mirrorOrigin)) {
    throw new Error(`Mirror links or canonical failed: ${prefix || 'Chinese'}`);
  }
  const search = readFileSync(join(destination, prefix, 'search.xml'), 'utf8');
  if (search.includes(mainOrigin)) throw new Error(`Search links still use main site: ${prefix}`);
}
console.log(`Prepared Neocities mirror: ${count} text assets, three languages, original canonicals preserved.`);

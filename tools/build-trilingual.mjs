import { rmSync, readFileSync, existsSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, relative, sep } from 'node:path';
import yaml from 'js-yaml';

const root = resolve(import.meta.dirname, '..');
const hexo = resolve(root, 'node_modules/.bin/hexo');
const builds = [
  ['Chinese', '_config.yml'],
  ['English', '_config.yml,_config.en.yml'],
  ['Italian', '_config.yml,_config.it.yml']
];

function validateMedia() {
  const file = resolve(root, 'data/media.yml');
  const items = yaml.load(readFileSync(file, 'utf8')) || [];
  if (!Array.isArray(items)) throw new Error('data/media.yml must contain a YAML list.');

  const ids = new Set();
  for (const item of items) {
    if (!item.id || ids.has(item.id)) throw new Error(`Missing or duplicate media id: ${item.id || '(empty)'}`);
    ids.add(item.id);
    if (!['book', 'game', 'movie'].includes(item.type)) throw new Error(`Invalid media type for ${item.id}.`);
    if (!item.title?.['zh-cn']) throw new Error(`Missing Chinese title for ${item.id}.`);
    if (!item.review || typeof item.review !== 'object') throw new Error(`Missing review fields for ${item.id}.`);
    const localCover = /^\/images\/media\/[^/]+\.(webp|avif|png|jpe?g)$/i.test(item.cover || '');
    const picxCover = item.cover?.startsWith('https://github.com/Vesaluna/picx-images-hosting/raw/master/media-library/');
    if (!localCover && !picxCover) throw new Error(`Invalid cover path for ${item.id}.`);
    if (localCover) {
      const coverPath = resolve(root, 'source', item.cover.replace(/^\//, ''));
      if (!existsSync(coverPath) || !statSync(coverPath).isFile()) {
        throw new Error(`Cover file does not exist for ${item.id}: ${item.cover}`);
      }
    }
  }
}

function markdownFiles(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === '_drafts') return [];
    const target = resolve(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(target) : (/\.md$/i.test(entry.name) ? [target] : []);
  });
}

function validateTranslations() {
  const sources = { 'zh-cn': 'source', en: 'source-en', it: 'source-it' };
  const keys = {};

  for (const [language, directory] of Object.entries(sources)) {
    keys[language] = new Set();
    for (const file of markdownFiles(resolve(root, directory))) {
      const text = readFileSync(file, 'utf8');
      const frontMatter = text.match(/^---\s*\n([\s\S]*?)\n---/);
      if (!frontMatter) throw new Error(`Missing front matter: ${file}`);
      const data = yaml.load(frontMatter[1]) || {};
      if (data.lang !== language) throw new Error(`Expected lang: ${language} in ${file}`);
      if (!data.translation_key) throw new Error(`Missing translation_key in ${file}`);
      if (file.includes(`${resolve(root, directory, '_posts')}/`)) {
        if (data.tags && (!Array.isArray(data.tags) || data.tags.length > 0)) {
          throw new Error(`Posts should not define tags: ${file}`);
        }
      }
      if (keys[language].has(data.translation_key)) {
        throw new Error(`Duplicate translation_key ${data.translation_key} for ${language}`);
      }
      if (file.includes(`${resolve(root, directory, '_posts')}/`) && language !== 'zh-cn' && data.ai_translation !== true) {
        throw new Error(`Missing ai_translation: true in ${file}`);
      }
      keys[language].add(data.translation_key);
    }
  }

  for (const language of ['en', 'it']) {
    for (const key of keys['zh-cn']) {
      if (!keys[language].has(key)) throw new Error(`Missing ${language} translation_key: ${key}`);
    }
    for (const key of keys[language]) {
      if (!keys['zh-cn'].has(key)) throw new Error(`Orphan ${language} translation_key: ${key}`);
    }
  }
}

validateMedia();
validateTranslations();
rmSync(resolve(root, 'public'), { recursive: true, force: true });

for (const [label, config] of builds) {
  rmSync(resolve(root, 'db.json'), { force: true });
  rmSync(resolve(root, '_multiconfig.yml'), { force: true });
  console.log(`\nBuilding ${label} site...`);
  const result = spawnSync(hexo, ['generate', '--config', config], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'production' }
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

function generateSitemap() {
  const publicDir = resolve(root, 'public');
  const origin = 'https://vesaluna.com';
  const urls = [];

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const target = resolve(directory, entry.name);
      if (entry.isDirectory()) {
        walk(target);
        continue;
      }
      if (entry.name !== 'index.html') continue;
      const rel = relative(publicDir, target).split(sep).join('/');
      const route = rel === 'index.html' ? '/' : `/${rel.replace(/index\.html$/, '')}`;
      // Exclude paginated slices from sitemap; keep canonical content and index routes.
      if (/\/page\/\d+\/$/.test(route)) continue;
      const mtime = statSync(target).mtime.toISOString().slice(0, 10);
      urls.push({ loc: encodeURI(`${origin}${route}`), lastmod: mtime });
    }
  }

  walk(publicDir);
  urls.sort((left, right) => left.loc.localeCompare(right.loc));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...urls.map((entry) => `  <url><loc>${entry.loc}</loc><lastmod>${entry.lastmod}</lastmod></url>`),
    '</urlset>',
    ''
  ].join('\n');
  writeFileSync(resolve(publicDir, 'sitemap.xml'), xml);
  console.log(`Generated sitemap.xml with ${urls.length} URLs.`);
}

rmSync(resolve(root, 'db.json'), { force: true });
rmSync(resolve(root, '_multiconfig.yml'), { force: true });
writeFileSync(resolve(root, 'public/.nojekyll'), '');
generateSitemap();
console.log('\nTrilingual build completed.');

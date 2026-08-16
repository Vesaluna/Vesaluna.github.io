import { rmSync, readFileSync, existsSync, writeFileSync, readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
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
    if (!item.review?.['zh-cn']) throw new Error(`Missing Chinese review for ${item.id}.`);
    if (!item.cover?.startsWith('/images/media/')) throw new Error(`Invalid local cover path for ${item.id}.`);
    if (!existsSync(resolve(root, 'source', item.cover.replace(/^\//, '')))) {
      throw new Error(`Cover file does not exist for ${item.id}: ${item.cover}`);
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
      if (keys[language].has(data.translation_key)) {
        throw new Error(`Duplicate translation_key ${data.translation_key} for ${language}`);
      }
      keys[language].add(data.translation_key);
    }
  }

  for (const language of ['en', 'it']) {
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

rmSync(resolve(root, 'db.json'), { force: true });
rmSync(resolve(root, '_multiconfig.yml'), { force: true });
writeFileSync(resolve(root, 'public/.nojekyll'), '');
console.log('\nTrilingual build completed.');

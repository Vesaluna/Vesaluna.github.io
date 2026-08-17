import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import yaml from 'js-yaml';

const root = resolve(import.meta.dirname, '..');
const output = resolve(root, 'public');
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function collectHtml(folder) {
  const htmlFiles = [];
  const walk = (current) => readdirSync(current, { withFileTypes: true }).forEach((entry) => {
    const target = join(current, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name.endsWith('.html')) htmlFiles.push(target);
  });
  walk(folder);
  return htmlFiles.map((file) => readFileSync(file, 'utf8')).join('\n');
}

function markdownFiles(folder) {
  return readdirSync(folder, { withFileTypes: true }).flatMap((entry) => {
    const target = join(folder, entry.name);
    if (entry.name.startsWith('.') || entry.name === '_drafts') return [];
    if (entry.isDirectory()) return markdownFiles(target);
    return entry.name.endsWith('.md') ? [target] : [];
  });
}

const required = [
  'index.html', 'about/index.html', 'works/index.html', 'CNAME', '.nojekyll',
  'en/index.html', 'en/about/index.html', 'en/works/index.html', 'en/atom.xml',
  'it/index.html', 'it/about/index.html', 'it/works/index.html', 'it/atom.xml',
  '2024/06/30/记录｜The first step/index.html',
  '2024/09/03/教程｜时间管理/index.html',
  '2024/09/12/练习｜Zorich数学分析下册Pag385n-2/index.html',
  '2024/09/14/随笔｜开学/index.html',
  '2024/09/28/教程｜视频格式从mkv转至mp4-加入ass字幕文件/index.html',
  '2024/10/12/随笔｜文学、历史与民族/index.html',
  '2024/10/19/随笔｜吉他/index.html',
  '2025/04/20/游记｜Firenze出游/index.html',
  '2025/09/27/随笔｜地铁/index.html',
  '2026/07/12/随笔｜飞机/index.html',
  '2026/07/15/闲谈｜滞留北京/index.html',
  '2026/07/16/游记｜遁入织金/index.html',
  '2026/07/18/游记｜访黄果树/index.html'
];

for (const relative of required) check(existsSync(join(output, relative)), `Missing output: ${relative}`);

for (const [language, directory] of [['zh-CN', ''], ['en', 'en'], ['it', 'it']]) {
  const home = readFileSync(join(output, directory, 'index.html'), 'utf8');
  check(home.includes(`<html lang="${language}">`), `Incorrect html lang for ${language}`);
  check(home.includes('rel="canonical"'), `Missing canonical link for ${language}`);
  check(home.includes('hreflang="x-default"'), `Missing x-default link for ${language}`);
}

const chineseTitles = ['游记｜访黄果树', '随笔｜飞机', '教程｜关于时间管理'];
for (const directory of ['en', 'it']) {
  const combined = collectHtml(join(output, directory));
  const visibleText = combined
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
  for (const title of chineseTitles) check(!visibleText.includes(title), `${directory} contains untranslated post: ${title}`);
}

const generatedHtml = collectHtml(output);
for (const placeholder of ['custom_css_source', 'custom_js_source', 'custom_mathjax_source']) {
  check(!generatedHtml.includes(placeholder), `Generated pages reference placeholder asset: ${placeholder}`);
}

let translatedPostCount = 0;
for (const [language, sourceDirectory] of [['en', 'source-en'], ['it', 'source-it']]) {
  for (const file of markdownFiles(resolve(root, sourceDirectory, '_posts'))) {
    const source = readFileSync(file, 'utf8');
    const frontMatter = source.match(/^---\s*\n([\s\S]*?)\n---/);
    const data = yaml.load(frontMatter?.[1] || '') || {};
    const route = join(output, language, String(data.permalink || ''), 'index.html');
    check(existsSync(route), `Missing translated route: ${language}/${data.permalink}`);
    if (existsSync(route)) {
      const html = readFileSync(route, 'utf8');
      check(html.includes('translation-notice'), `Missing AI translation notice: ${language}/${data.permalink}`);
      check(html.includes('hreflang="zh-cn"'), `Missing source-version link: ${language}/${data.permalink}`);
    }
    translatedPostCount += 1;
  }
}
check(translatedPostCount === 26, `Expected 26 translated posts, found ${translatedPostCount}`);

const media = yaml.load(readFileSync(resolve(root, 'data/media.yml'), 'utf8')) || [];
const mediaPage = readFileSync(join(output, 'works/index.html'), 'utf8');
const steamGames = media.filter((item) => item.type === 'game' && item.steam_appid);
check(mediaPage.includes('2025 年第一季度'), 'Works page is missing quarterly grouping.');
check(mediaPage.includes('日期未记录'), 'Works page is missing the undated group.');
check(mediaPage.includes('Steam 游戏时长'), 'Works page is missing Steam playtime details.');
check(steamGames.length === 16, `Expected 16 Steam library entries, found ${steamGames.length}.`);
for (const item of media) {
  if (item.cover.startsWith('/')) {
    const cover = resolve(output, item.cover.replace(/^\//, ''));
    check(existsSync(cover), `Missing generated cover: ${item.cover}`);
  }
  check(mediaPage.includes(item.cover), `Works page does not reference cover: ${item.id}`);
}
for (const item of steamGames) {
  check(item.id === `steam-${item.steam_appid}`, `Steam id mismatch: ${item.id}`);
  check(item.link === `https://store.steampowered.com/app/${item.steam_appid}`, `Steam link mismatch: ${item.id}`);
}

check(readFileSync(join(output, 'CNAME'), 'utf8').trim() === 'vesaluna.com', 'CNAME changed unexpectedly');

if (failures.length) {
  console.error(`Verification failed:\n- ${failures.join('\n- ')}`);
  process.exit(1);
}

console.log(`Verified ${required.length} required routes, ${translatedPostCount} translated posts, three language roots and media data.`);

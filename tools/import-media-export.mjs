import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import yaml from 'js-yaml';

function option(name, fallback = '') {
  const index = process.argv.indexOf(name);
  return index === -1 ? fallback : process.argv[index + 1];
}

const input = process.argv[2];
const output = resolve(option('--output', 'data/media.yml'));
const manifest = option('--manifest');
const coverBase = option(
  '--cover-base',
  'https://github.com/Vesaluna/picx-images-hosting/raw/master/media-library'
).replace(/\/$/, '');
const overridesFile = resolve(option('--overrides', 'data/media-overrides.yml'));

if (!input) {
  console.error('Usage: node tools/import-media-export.mjs <export.db> [--output data/media.yml] [--manifest manifest.json]');
  process.exit(1);
}

function decodeExport(file) {
  const encoded = readFileSync(file, 'utf8').trim();
  const bytes = Buffer.from(encoded, 'base64');
  for (let index = 0; index < bytes.length; index += 1) {
    bytes[index] ^= index % 2 ? 0x78 : 0x6e;
  }
  return JSON.parse(bytes.toString('utf8'));
}

function richness(value) {
  return Object.values(value || {}).filter((entry) => {
    if (Array.isArray(entry)) return entry.length;
    return entry !== '' && entry != null;
  }).length;
}

function referenceId(value) {
  return typeof value === 'object' && value ? value.objectId : value;
}

function names(value) {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => typeof entry === 'string' ? entry : entry?.name).filter(Boolean);
}

function localized(value) {
  return { 'zh-cn': value || '', en: '', it: '' };
}

function completionTime(record) {
  if (record.finishTime) return record.finishTime;
  const completed = [...(record.times || [])].reverse().find((entry) => entry.state === 3 && entry.time);
  return completed?.time || '';
}

function calendarDate(timestamp) {
  if (!timestamp) return '';
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date(Number(timestamp)));
  const get = (type) => parts.find((part) => part.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}`;
}

function publicationYear(media) {
  const values = Array.isArray(media.pubdate) ? media.pubdate : [media.pubdate];
  return values.filter(Boolean).map(String).join(' ').match(/(?:19|20)\d{2}/)?.[0] || '';
}

function originalTitle(media) {
  const aliases = Array.isArray(media.aka) ? media.aka : [];
  return aliases.find((title) => /[A-Za-z]/.test(title) && title !== media.title) || '';
}

function creator(media) {
  const values = media.type === 'book' ? names(media.author) : names(media.directors);
  return values.slice(0, 3).join('、');
}

function comments(records) {
  return records.flatMap((record) => {
    if (typeof record.comments === 'string') return [record.comments];
    if (Array.isArray(record.comments)) return record.comments.map((comment) => comment?.content);
    return [];
  }).filter((comment) => typeof comment === 'string' && comment.trim());
}

const data = decodeExport(input);
if (!Array.isArray(data.media) || !Array.isArray(data.record)) {
  throw new Error('The export does not contain media and record arrays.');
}

const mediaById = new Map();
for (const media of data.media) {
  const current = mediaById.get(media.objectId);
  if (!current || richness(media) > richness(current)) mediaById.set(media.objectId, media);
}

const tagById = new Map((data.tag || []).map((tag) => [tag.objectId, tag.name]));
const overrides = existsSync(overridesFile) ? (yaml.load(readFileSync(overridesFile, 'utf8')) || {}) : {};
const previous = existsSync(output) ? (yaml.load(readFileSync(output, 'utf8')) || []) : [];
const previousById = new Map(previous.map((item) => [item.id, item]));
const covers = [];
const completedByMedia = new Map();

for (const record of data.record.filter((entry) => entry.state === 3)) {
  const mediaId = referenceId(record.media);
  if (!completedByMedia.has(mediaId)) completedByMedia.set(mediaId, []);
  completedByMedia.get(mediaId).push(record);
}

const items = [...completedByMedia.entries()]
  .map(([mediaId, records]) => {
    const record = [...records].sort((left, right) => Number(completionTime(right) || 0) - Number(completionTime(left) || 0))[0];
    const media = mediaById.get(mediaId);
    if (!media?.objectId || !media.title || !media.poster) {
      throw new Error(`Completed record is missing media metadata: ${mediaId || '(unknown)'}`);
    }

    const id = `media-${media.objectId}`;
    const filename = `${id}.webp`;
    const poster = overrides[id]?.poster || media.poster;
    const saved = previousById.get(id);
    const recordTags = records.flatMap((entry) => entry.tags || []).map(referenceId).map((tag) => tagById.get(tag)).filter(Boolean);
    const kind = media.type === 'tv' ? '剧集' : media.type === 'movie' ? '电影' : '';
    const savedComment = comments(records)[0];
    const review = {
      'zh-cn': saved?.review?.['zh-cn'] || savedComment?.trim() || '',
      en: saved?.review?.en || '',
      it: saved?.review?.it || ''
    };

    covers.push({ id, title: media.title, source: poster, filename });
    return {
      id,
      type: media.type === 'book' ? 'book' : 'movie',
      title: localized(media.title),
      original_title: localized(originalTitle(media)),
      creator: localized(creator(media)),
      cover: `${coverBase}/${filename}`,
      cover_source: poster,
      year: publicationYear(media),
      finished_on: calendarDate(completionTime(record)),
      completed_count: records.length,
      tags: [...new Set([kind, ...recordTags].filter(Boolean))],
      link: media.url || '',
      review
    };
  })
  .sort((left, right) => String(right.finished_on).localeCompare(String(left.finished_on)) || left.title['zh-cn'].localeCompare(right.title['zh-cn'], 'zh-CN'));

const ids = new Set(items.map((item) => item.id));
if (ids.size !== items.length) throw new Error('Duplicate completed media records were found.');

const instructions = [
  '# 已阅数据由导入工具生成。写短评时搜索作品标题，只修改对应的 review 内容。',
  '# zh-cn 是中文短评；en 和 it 可留空，外语页面会自动显示中文并标注。',
  '# 再次导入新的 App 备份时，已有短评会按 id 保留。',
  ''
].join('\n');

writeFileSync(output, instructions + yaml.dump(items, {
  noRefs: true,
  lineWidth: 100,
  quotingType: "'",
  forceQuotes: false
}));

if (manifest) writeFileSync(resolve(manifest), `${JSON.stringify(covers, null, 2)}\n`);
console.log(`Imported ${items.length} completed works from ${data.record.filter((record) => record.state === 3).length} completion records into ${output}.`);

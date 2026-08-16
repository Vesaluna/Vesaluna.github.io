'use strict';

const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const LANGUAGES = {
  'zh-cn': { label: '中文', prefix: '', source: 'source' },
  en: { label: 'EN', prefix: 'en', source: 'source-en' },
  it: { label: 'IT', prefix: 'it', source: 'source-it' }
};

function markdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (entry.name.startsWith('.') || entry.name === '_drafts') return [];
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return markdownFiles(target);
    return /\.md$/i.test(entry.name) ? [target] : [];
  });
}

function parseDocument(file) {
  const source = fs.readFileSync(file, 'utf8');
  const match = source.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) return { data: {}, source };
  return { data: yaml.load(match[1]) || {}, source };
}

function normalizeRoute(route) {
  const value = String(route || '').replace(/^\/+/, '').replace(/index\.html$/, '');
  return `/${value}${value && !value.endsWith('/') ? '/' : ''}`;
}

function prefixRoute(route, language) {
  const normalized = normalizeRoute(route);
  const prefix = LANGUAGES[language].prefix;
  if (!prefix) return normalized;
  if (normalized === `/${prefix}/` || normalized.startsWith(`/${prefix}/`)) return normalized;
  return `/${prefix}${normalized}`;
}

function routeFor(file, sourceRoot, language, document) {
  if (document.data.permalink) return prefixRoute(document.data.permalink, language);

  const relative = path.relative(sourceRoot, file).split(path.sep).join('/');
  if (relative.startsWith('_posts/')) {
    const dateMatch = document.source.match(/^date:\s*(\d{4})-(\d{2})-(\d{2})/m);
    if (!dateMatch) return null;
    const slug = path.basename(relative, path.extname(relative));
    return prefixRoute(`${dateMatch[1]}/${dateMatch[2]}/${dateMatch[3]}/${slug}/`, language);
  }

  const pageRoute = relative
    .replace(/(^|\/)index\.md$/i, '$1')
    .replace(/\.md$/i, '/');
  return prefixRoute(pageRoute, language);
}

function buildTranslationMap() {
  const translations = {};
  Object.entries(LANGUAGES).forEach(([language, settings]) => {
    const sourceRoot = path.join(hexo.base_dir, settings.source);
    markdownFiles(sourceRoot).forEach((file) => {
      const document = parseDocument(file);
      const key = document.data.translation_key;
      if (!key) return;
      const route = routeFor(file, sourceRoot, language, document);
      if (!route) return;
      translations[key] ||= {};
      translations[key][language] = route;
    });
  });
  return translations;
}

const translationMap = buildTranslationMap();

function currentLanguage(page) {
  const configured = Array.isArray(this.config.language)
    ? this.config.language[0]
    : this.config.language;
  return String(page.lang || configured || 'zh-cn').toLowerCase();
}

function origin() {
  return new URL(this.config.url).origin;
}

function commonRoute(page, targetLanguage) {
  const rawPath = String(page.path || '').replace(/^\/+/, '');
  if (!rawPath || rawPath === 'index.html') return prefixRoute('/', targetLanguage);
  if (/^(archives|tags|categories)(\/|$)/.test(rawPath)) {
    return prefixRoute(rawPath, targetLanguage);
  }
  return prefixRoute('/', targetLanguage);
}

hexo.extend.helper.register('language_switches', function languageSwitches(page) {
  const current = currentLanguage.call(this, page);
  const keyedRoutes = page.translation_key ? translationMap[page.translation_key] : null;

  return Object.entries(LANGUAGES).map(([code, settings]) => {
    const route = keyedRoutes ? keyedRoutes[code] : commonRoute(page, code);
    return {
      code,
      label: settings.label,
      current: code === current,
      available: Boolean(route),
      url: route || null
    };
  });
});

hexo.extend.helper.register('canonical_url', function canonicalUrl(page) {
  const route = this.url_for(page.path).replace(/index\.html$/, '');
  return `${origin.call(this)}${route}`;
});

hexo.extend.helper.register('alternate_links', function alternateLinks(page) {
  const switches = this.language_switches(page).filter((item) => item.available);
  const links = switches.map((item) => ({
    lang: item.code,
    url: encodeURI(`${origin.call(this)}${item.url}`)
  }));
  const defaultLink = links.find((item) => item.lang === 'zh-cn');
  if (defaultLink) links.push({ lang: 'x-default', url: defaultLink.url });
  return links;
});

function localized(value, language) {
  if (value == null) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return value[language] || value['zh-cn'] || value.en || value.it || '';
}

function dateOnly(value) {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function mediaData() {
  const file = path.join(hexo.base_dir, 'data', 'media.yml');
  if (!fs.existsSync(file)) return [];
  const parsed = yaml.load(fs.readFileSync(file, 'utf8'));
  return Array.isArray(parsed) ? parsed : [];
}

hexo.extend.helper.register('media_items', function mediaItems(page) {
  const language = currentLanguage.call(this, page);
  return mediaData().map((item) => {
    const requestedReview = localized(item.review && item.review[language], language);
    const chineseReview = localized(item.review && item.review['zh-cn'], 'zh-cn');
    return {
      id: item.id,
      type: item.type,
      title: localized(item.title, language),
      originalTitle: localized(item.original_title, language),
      creator: localized(item.creator, language),
      cover: item.cover,
      year: item.year,
      finishedOn: dateOnly(item.finished_on),
      tags: Array.isArray(item.tags) ? item.tags : [],
      link: item.link || '',
      review: requestedReview || chineseReview,
      reviewFallback: language !== 'zh-cn' && !requestedReview && Boolean(chineseReview)
    };
  });
});

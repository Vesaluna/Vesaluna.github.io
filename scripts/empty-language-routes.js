'use strict';

hexo.extend.generator.register('empty-language-routes', function (locals) {
  const language = Array.isArray(this.config.language)
    ? this.config.language[0]
    : this.config.language;

  if (language === 'zh-cn' || locals.posts.length > 0) return [];

  const siteUrl = this.config.url.replace(/\/$/, '');
  const updated = new Date().toISOString();
  const feed = `<?xml version="1.0" encoding="utf-8"?>\n` +
    `<feed xmlns="http://www.w3.org/2005/Atom">\n` +
    `  <title>${this.config.title}</title>\n` +
    `  <link href="${siteUrl}/"/>\n` +
    `  <link href="${siteUrl}/atom.xml" rel="self"/>\n` +
    `  <updated>${updated}</updated>\n` +
    `  <id>${siteUrl}/</id>\n` +
    `</feed>\n`;

  return [
    {
      path: 'index.html',
      layout: 'language-home',
      data: { title: this.config.title, lang: language, layout: 'language-home' }
    },
    {
      path: 'archives/index.html',
      layout: 'archive-empty',
      data: { title: this.theme.i18n?.Archive || 'Archive', lang: language, layout: 'archive-empty', archive: true }
    },
    { path: 'atom.xml', data: feed }
  ];
});


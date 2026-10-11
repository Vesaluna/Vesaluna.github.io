'use strict';

const pagination = require('hexo-pagination');

hexo.extend.generator.register('index', function (locals) {
  const config = this.config;
  const posts = locals.posts
    .sort(config.index_generator.order_by)
    .toArray()
    .filter((post) => !String(post.translation_key || '').startsWith('reprint-'));

  posts.sort((a, b) => (b.sticky || 0) - (a.sticky || 0));

  const { Query } = this.model('Post');

  return pagination(config.index_generator.path || '', new Query(posts), {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: `${config.pagination_dir || 'page'}/%d/`,
    data: { __index: true }
  });
});

'use strict';

const generateArchive = require('hexo-generator-archive/lib/generator');

hexo.extend.generator.register('archive', function (locals) {
  const { Query } = this.model('Post');
  const posts = locals.posts.toArray().filter((post) =>
    !String(post.translation_key || '').startsWith('reprint-'));

  return generateArchive.call(this, { ...locals, posts: new Query(posts) });
});

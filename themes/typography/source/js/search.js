(function () {
  'use strict';

  var page = document.querySelector('[data-search-page]');
  if (!page) return;

  var form = page.querySelector('.site-search-form');
  var input = page.querySelector('#site-search-input');
  var status = page.querySelector('.site-search-status');
  var results = page.querySelector('.site-search-results');
  var entries = [];
  var ready = false;

  function label(name) {
    return page.getAttribute('data-search-' + name) || '';
  }

  function plainText(html) {
    var container = document.createElement('div');
    container.innerHTML = html || '';
    return (container.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function normalizeUrl(value) {
    return (value || '/').replace(/\/{2,}/g, '/');
  }

  function excerpt(text, query) {
    var lower = text.toLocaleLowerCase();
    var index = lower.indexOf(query);
    var start = index > 60 ? index - 60 : 0;
    var value = text.slice(start, start + 180).trim();
    return (start ? '…' : '') + value + (start + 180 < text.length ? '…' : '');
  }

  function render() {
    var query = input.value.trim().toLocaleLowerCase();
    results.textContent = '';

    if (!query) {
      status.textContent = label('prompt');
      return;
    }
    if (!ready) return;

    var terms = query.split(/\s+/).filter(Boolean);
    var matches = entries.filter(function (entry) {
      return terms.every(function (term) { return entry.haystack.indexOf(term) !== -1; });
    }).sort(function (left, right) {
      var leftScore = left.titleLower.indexOf(query) !== -1 ? 2 : 0;
      var rightScore = right.titleLower.indexOf(query) !== -1 ? 2 : 0;
      return rightScore - leftScore;
    }).slice(0, 30);

    status.textContent = matches.length
      ? label('count').replace('{count}', String(matches.length))
      : label('empty');

    matches.forEach(function (entry) {
      var item = document.createElement('li');
      var link = document.createElement('a');
      var summary = document.createElement('p');
      link.href = entry.url;
      link.textContent = entry.title;
      summary.textContent = excerpt(entry.content, query);
      item.appendChild(link);
      if (summary.textContent) item.appendChild(summary);
      results.appendChild(item);
    });
  }

  fetch(page.getAttribute('data-search-index'))
    .then(function (response) {
      if (!response.ok) throw new Error('Search index unavailable');
      return response.text();
    })
    .then(function (source) {
      var xml = new DOMParser().parseFromString(source, 'application/xml');
      entries = Array.prototype.map.call(xml.querySelectorAll('entry'), function (entry) {
        var title = (entry.querySelector('title') || {}).textContent || '';
        var content = plainText((entry.querySelector('content') || {}).textContent || '');
        return {
          title: title,
          titleLower: title.toLocaleLowerCase(),
          content: content,
          haystack: (title + ' ' + content).toLocaleLowerCase(),
          url: normalizeUrl((entry.querySelector('url') || {}).textContent || '/')
        };
      });
      ready = true;
      render();
    })
    .catch(function () {
      ready = true;
      status.textContent = label('error');
    });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    render();
  });
  input.addEventListener('input', render);
}());

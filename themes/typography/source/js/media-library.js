(function () {
  'use strict';

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-media-id]'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-media-filter]'));
  var years = Array.prototype.slice.call(document.querySelectorAll('button[data-media-year]'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-media-group]'));
  var empty = document.querySelector('.media-filter-empty');
  if (!cards.length && !filters.length && !years.length) return;

  var selectedType = 'all';
  var selectedYear = 'all';

  function updateVisible() {
    cards.forEach(function (card) {
      var group = card.closest('[data-media-group]');
      var matchesYear = selectedYear === 'all' || (group && group.getAttribute('data-media-year') === selectedYear);
      var matchesType = selectedType === 'all' || card.getAttribute('data-media-type') === selectedType;
      card.hidden = !matchesYear || !matchesType;
    });
    groups.forEach(function (group) {
      group.hidden = !Array.prototype.some.call(group.querySelectorAll('[data-media-id]'), function (card) {
        return !card.hidden;
      });
    });
    if (empty) empty.hidden = cards.some(function (card) { return !card.hidden; });
  }

  filters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      selectedType = filter.getAttribute('data-media-filter');
      filters.forEach(function (item) {
        var active = item === filter;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateVisible();
    });
  });

  years.forEach(function (year) {
    year.addEventListener('click', function () {
      selectedYear = year.getAttribute('data-media-year');
      years.forEach(function (item) {
        var active = item === year;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      updateVisible();
    });
  });

  var dialog = document.getElementById('media-dialog');
  var dataNode = document.getElementById('media-library-data');
  if (!dialog || !dataNode) return;

  var itemsById = {};
  try {
    var parsed = JSON.parse(dataNode.textContent || '[]');
    if (Array.isArray(parsed)) {
      parsed.forEach(function (item) {
        if (item && item.id) itemsById[item.id] = item;
      });
    }
  } catch (_) {
    return;
  }

  var closeButton = dialog.querySelector('.media-dialog-close');
  var coverEl = dialog.querySelector('.media-dialog-cover');
  var titleEl = dialog.querySelector('#media-dialog-title');
  var bodyEl = dialog.querySelector('.media-dialog-body');
  var activeCard = null;

  function label(name) {
    return dialog.getAttribute('data-label-' + name) || '';
  }

  function addDetail(parent, labelText, value) {
    if (!value) return;
    var p = document.createElement('p');
    p.className = 'media-detail';
    var strong = document.createElement('strong');
    strong.textContent = labelText + ': ';
    p.appendChild(strong);
    p.appendChild(document.createTextNode(String(value)));
    parent.appendChild(p);
  }

  function addLink(parent, href, text, external) {
    if (!href) return;
    var p = document.createElement('p');
    var a = document.createElement('a');
    a.href = href;
    a.textContent = text;
    if (external) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    p.appendChild(a);
    parent.appendChild(p);
  }

  function openItem(item, card) {
    activeCard = card;
    titleEl.textContent = item.title || '';

    if (item.cover) {
      coverEl.src = item.cover;
      coverEl.hidden = false;
    } else {
      coverEl.removeAttribute('src');
      coverEl.hidden = true;
    }

    bodyEl.textContent = '';
    addDetail(bodyEl, label('original-title'), item.originalTitle);
    addDetail(bodyEl, label('creator'), item.creator);
    addDetail(bodyEl, label('year'), item.year);
    addDetail(bodyEl, label('finished-on'), item.finishedOn);
    addDetail(bodyEl, label('steam-playtime'), item.playtime);
    addDetail(bodyEl, label('last-played-on'), item.lastPlayedOn);
    addDetail(bodyEl, label('steam-acquired-on'), item.acquiredOn);
    if (item.completedCount > 1) {
      addDetail(bodyEl, label('completed-count'), item.completedCount);
    }

    if (Array.isArray(item.tags) && item.tags.length) {
      var ul = document.createElement('ul');
      ul.className = 'media-tags';
      ul.setAttribute('aria-label', label('tags'));
      item.tags.forEach(function (tag) {
        var li = document.createElement('li');
        li.textContent = tag;
        ul.appendChild(li);
      });
      bodyEl.appendChild(ul);
    }

    if (item.hasReview) {
      if (item.reviewFallback) {
        var fallback = document.createElement('p');
        fallback.className = 'media-fallback';
        fallback.textContent = label('chinese-only');
        bodyEl.appendChild(fallback);
      }
      var review = document.createElement('p');
      review.className = 'media-review';
      review.textContent = item.review;
      bodyEl.appendChild(review);
    } else {
      var pending = document.createElement('p');
      pending.className = 'media-review-pending';
      pending.textContent = label('review-pending');
      bodyEl.appendChild(pending);
    }

    addLink(bodyEl, item.articleUrl, label('related-article'), false);
    addLink(bodyEl, item.link, label('more-info'), true);

    dialog.showModal();
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () {
      var item = itemsById[card.getAttribute('data-media-id')];
      if (item) openItem(item, card);
    });
  });

  if (closeButton) closeButton.addEventListener('click', function () { dialog.close(); });
  dialog.addEventListener('cancel', function (event) {
    event.preventDefault();
    dialog.close();
  });
  dialog.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) dialog.close();
  });
  dialog.addEventListener('close', function () {
    if (activeCard) activeCard.focus();
  });
}());

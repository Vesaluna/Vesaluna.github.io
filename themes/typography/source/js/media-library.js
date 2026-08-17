(function () {
  'use strict';

  var cards = Array.prototype.slice.call(document.querySelectorAll('[data-media-target]'));
  var filters = Array.prototype.slice.call(document.querySelectorAll('[data-media-filter]'));
  var groups = Array.prototype.slice.call(document.querySelectorAll('[data-media-group]'));
  var empty = document.querySelector('.media-filter-empty');
  if (!cards.length && !filters.length) return;

  filters.forEach(function (filter) {
    filter.addEventListener('click', function () {
      var selected = filter.getAttribute('data-media-filter');
      filters.forEach(function (item) {
        var active = item === filter;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      cards.forEach(function (card) {
        card.hidden = selected !== 'all' && card.getAttribute('data-media-type') !== selected;
      });
      groups.forEach(function (group) {
        group.hidden = !Array.prototype.some.call(group.querySelectorAll('[data-media-target]'), function (card) {
          return !card.hidden;
        });
      });
      if (empty) empty.hidden = cards.some(function (card) { return !card.hidden; });
    });
  });

  cards.forEach(function (card) {
    var dialog = document.getElementById(card.getAttribute('data-media-target'));
    if (!dialog) return;
    var close = dialog.querySelector('.media-dialog-close');

    card.addEventListener('click', function () {
      dialog.showModal();
    });
    if (close) close.addEventListener('click', function () { dialog.close(); });
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
      card.focus();
    });
  });
}());

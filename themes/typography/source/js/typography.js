(function () {
  'use strict';

  function init() {

    var siteTitle = document.querySelector('.site-title');
    if (siteTitle) {
      siteTitle.addEventListener('click', function (event) {
        if (event.target.closest('a')) return;
        var link = siteTitle.querySelector('a');
        if (link) link.click();
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());

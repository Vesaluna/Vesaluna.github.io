(function () {
  'use strict';

  var lastWidth = '';
  var rafId = 0;

  function updateSidebar() {
    rafId = 0;
    var stage = document.getElementById('stage');
    var sideBar = document.getElementById('side-bar');
    var mainContainer = document.getElementById('main-container');
    if (!stage || !sideBar || !mainContainer) return;

    var nextWidth;
    if (window.innerWidth <= 768 || window.innerHeight <= 600) {
      mainContainer.classList.remove('col-sm-9');
      nextWidth = stage.clientWidth + 'px';
    } else {
      mainContainer.classList.add('col-sm-9');
      var sidebarW =
        stage.clientWidth - mainContainer.offsetWidth + (window.innerWidth - stage.clientWidth) / 2;
      nextWidth = Math.max(0, sidebarW) + 'px';
    }

    if (nextWidth !== lastWidth) {
      sideBar.style.width = nextWidth;
      lastWidth = nextWidth;
    }
  }

  function scheduleUpdate() {
    if (rafId) return;
    rafId = window.requestAnimationFrame(updateSidebar);
  }

  function init() {
    updateSidebar();
    window.addEventListener('resize', scheduleUpdate, { passive: true });

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

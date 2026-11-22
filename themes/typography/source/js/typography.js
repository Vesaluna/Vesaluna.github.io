(function () {
  'use strict';

  function updateSidebar() {
    var stage = document.getElementById('stage');
    var sideBar = document.getElementById('side-bar');
    var mainContainer = document.getElementById('main-container');
    if (!stage || !sideBar || !mainContainer) return;

    if (window.innerWidth <= 768 || window.innerHeight <= 600) {
      sideBar.style.width = stage.clientWidth + 'px';
      mainContainer.classList.remove('col-sm-9');
    } else {
      mainContainer.classList.add('col-sm-9');
      var sidebarW =
        stage.clientWidth - mainContainer.offsetWidth + (window.innerWidth - stage.clientWidth) / 2;
      sideBar.style.width = Math.max(0, sidebarW) + 'px';
    }
  }

  function init() {
    var sideBar = document.getElementById('side-bar');
    var mainContainer = document.getElementById('main-container');

    window.addEventListener('resize', updateSidebar);
    updateSidebar();

    if (mainContainer) {
      mainContainer.classList.remove('invisible');
      mainContainer.classList.add('fadeInTop');
    }
    if (sideBar) {
      sideBar.classList.remove('invisible');
      sideBar.classList.add(window.innerWidth <= 768 ? 'fadeInTop' : 'fadeInRight');
    }

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

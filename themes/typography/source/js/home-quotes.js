(function () {
  var container = document.querySelector('.home-quote[data-quotes]');
  if (!container) return;

  var quotes;
  try {
    quotes = JSON.parse(container.getAttribute('data-quotes'));
  } catch (_) {
    return;
  }
  if (!Array.isArray(quotes) || !quotes.length) return;

  window.addEventListener('pageshow', function () {
    var index = Math.floor(Math.random() * quotes.length);
    container.querySelector('p').textContent = quotes[index];
  });
}());

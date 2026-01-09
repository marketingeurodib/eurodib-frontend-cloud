// Аккордеон: множественное открытие
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const body = header.nextElementSibling;
    body.classList.toggle('open');
  });
});

// Переключение миниатюр
document.querySelectorAll('.thumb').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelector('.main-image').src = btn.querySelector('img').src;
  });
});





(function () {
  var BREAKPOINT = 768;
  var topContainer = document.querySelector('.top-container');
  var leftColumn   = document.querySelector('.left-column');
  var rightColumn  = document.querySelector('.right-column');
  var infoSection  = leftColumn ? leftColumn.querySelector('.info-section') : null;

  if (!topContainer || !leftColumn || !rightColumn || !infoSection) return;

  var originalNext = infoSection.nextSibling;
  var originalParent = leftColumn;

  function reorder() {
    if (window.innerWidth <= BREAKPOINT) {
      if (infoSection.parentNode !== topContainer) {
        topContainer.insertBefore(infoSection, rightColumn.nextSibling);
      }
    } else {
      if (infoSection.parentNode !== originalParent) {
        if (originalNext && originalNext.parentNode === originalParent) {
          originalParent.insertBefore(infoSection, originalNext);
        } else {
          originalParent.appendChild(infoSection);
        }
      }
    }
  }

  reorder();
  window.addEventListener('resize', reorder);
})();

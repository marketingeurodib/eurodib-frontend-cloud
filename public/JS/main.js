// ======================
// ГЛАВНАЯ ИНИЦИАЛИЗАЦИЯ
// ======================

document.addEventListener('DOMContentLoaded', () => {
  console.log('Website fully loaded');

  const hasSwiper = typeof Swiper !== 'undefined';

  // ✅ Слайдер брендов (если есть .brands-slider и подключён Swiper)
  if (hasSwiper) {
    const brandSlider = document.querySelector('.brands-slider');
    if (brandSlider) {
      new Swiper(brandSlider, {
        slidesPerView: 'auto',
        spaceBetween: 24,
        loop: false,
        freeMode: true,
        speed: 500,
        autoplay: {
          delay: 2000,
          disableOnInteraction: false,
        },
      });
    }

    // ✅ Главный баннер-слайдер (hero, .mySwiper) - теперь управляется через React компонент HeroSlider
    // Инициализация удалена, так как слайдер управляется через npm пакет Swiper в React
  } else {
    console.warn('Swiper is not loaded yet. Sliders initialization skipped in main DOMContentLoaded handler.');
  }

  // ✅ Hover-эффект замены изображений брендов (если заданы data-color)
  document.querySelectorAll('.brand-img').forEach(function (img) {
    img.addEventListener('mouseenter', function () {
      if (this.dataset.color) {
        this.dataset.original = this.src;
        this.src = this.dataset.color;
        this.style.filter = 'none';
      }
    });
    img.addEventListener('mouseleave', function () {
      if (this.dataset.original) {
        this.src = this.dataset.original;
        this.style.filter = '';
      }
    });
  });

  // ✅ Языковое меню “amazon style” (шапка, .language-switcher-amazon-style)
  const langSelector = document.querySelector('.lang-selector');
  const langMenu = document.getElementById('langMenu');
  const langOptions = document.querySelectorAll('.lang-option');

  if (langSelector && langMenu) {
    langSelector.addEventListener('click', (e) => {
      e.stopPropagation();
      langMenu.style.display = langMenu.style.display === 'block' ? 'none' : 'block';
    });

    langOptions.forEach((option) => {
      option.addEventListener('click', () => {
        const selectedLang = option.getAttribute('onclick')?.match(/'(.*?)'/)?.[1];
        if (selectedLang) {
          alert('Language changed to: ' + selectedLang);
          langMenu.style.display = 'none';
        }
      });
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.language-switcher-amazon-style')) {
        langMenu.style.display = 'none';
      }
    });
  }
});

// ======================
// ПОИСК (фильтрация)
// ======================

function filterSearch() {
  const input = document.getElementById('searchInput')?.value.toLowerCase() || '';
  const dropdown = document.getElementById('searchDropdown');
  const categories = document.querySelectorAll('#categoryResults li');
  const products = document.querySelectorAll('#productResults .product-item');

  if (!dropdown) return;

  if (input.length >= 3) {
    dropdown.classList.add('active');

    categories.forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(input) ? 'list-item' : 'none';
    });

    products.forEach((item) => {
      item.style.display = item.textContent.toLowerCase().includes(input) ? 'flex' : 'none';
    });
  } else {
    dropdown.classList.remove('active');
  }
}

// ======================
// ДЕСКТОП-НАВИГАЦИЯ (#menuToggle / #primaryNav)
// ======================

(function () {
  const btn = document.getElementById('menuToggle');
  const nav = document.getElementById('primaryNav');

  function closeNav() {
    document.body.classList.remove('nav-open');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  }

  if (btn && nav) {
    btn.addEventListener('click', function () {
      const open = document.body.classList.toggle('nav-open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Закрытие по клику вне
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      if (!e.target.closest('#primaryNav') && !e.target.closest('#menuToggle')) closeNav();
    });

    // Закрытие по ESC
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }
})();

// ======================
// ЯЗЫКОВОЙ СВИЧЕР (старый вариант)
// ======================

function toggleLangMenu(e) {
  e.stopPropagation();
  const root = e.currentTarget.closest('.language-switcher-amazon-style');
  if (!root) return;
  const menu = root.querySelector('.lang-menu');
  if (!menu) return;

  // закрыть другие раскрытые меню
  document
    .querySelectorAll('.language-switcher-amazon-style .lang-menu.show')
    .forEach((m) => {
      if (m !== menu) m.classList.remove('show');
    });

  menu.classList.toggle('show');
}

// закрытие по клику вне
document.addEventListener('click', () => {
  document
    .querySelectorAll('.language-switcher-amazon-style .lang-menu.show')
    .forEach((m) => m.classList.remove('show'));
});

// пример смены языка
function selectLang(code) {
  // TODO: логика смены языка
  document
    .querySelectorAll('.language-switcher-amazon-style .lang-menu.show')
    .forEach((m) => m.classList.remove('show'));
}

// ======================
// МОБИЛЬНОЕ МЕНЮ (#edb-burger / #edb-menu) + .edb-lang
// ======================

(function () {
  const body = document.body;
  const burger = document.getElementById('edb-burger');
  const menu = document.getElementById('edb-menu');

  function lockScroll(lock) {
    if (lock) {
      body.dataset.edbScrollY = String(window.scrollY || 0);
      body.style.position = 'fixed';
      body.style.top = `-${body.dataset.edbScrollY}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
    } else {
      const y = parseInt(body.dataset.edbScrollY || '0', 10);
      body.style.position = '';
      body.style.top = '';
      body.style.left = '';
      body.style.right = '';
      body.style.width = '';
      window.scrollTo(0, y);
      delete body.dataset.edbScrollY;
    }
  }

  function toggleMenu(forceOpen) {
    if (!menu) return;
    const willOpen = typeof forceOpen === 'boolean' ? forceOpen : !menu.classList.contains('open');
    menu.classList.toggle('open', willOpen);
    if (burger) burger.setAttribute('aria-expanded', String(willOpen));
    menu.setAttribute('aria-hidden', String(!willOpen));
    lockScroll(willOpen);
    if (!willOpen) closeLangDropdown(); // при закрытии меню — прячем языки
  }

  if (burger && menu) {
    burger.addEventListener('click', () => toggleMenu());
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('open')) toggleMenu(false);
    });
    window.addEventListener('resize', () => {
      if (window.matchMedia('(min-width: 981px)').matches && menu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  const langBtn = document.getElementById('edb-lang-btn');
  const langPanel = document.getElementById('edb-lang-panel');

  function closeLangDropdown() {
    if (!langPanel || !langBtn) return;
    langPanel.classList.remove('is-visible');
    langBtn.setAttribute('aria-expanded', 'false');
  }

  function openLangDropdown() {
    if (!langPanel || !langBtn) return;
    document
      .querySelectorAll('.edb-lang-panel.is-visible')
      .forEach((p) => p !== langPanel && p.classList.remove('is-visible'));
    langPanel.classList.add('is-visible');
    langBtn.setAttribute('aria-expanded', 'true');
  }

  if (langBtn && langPanel) {
    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = langPanel.classList.contains('is-visible');
      if (isOpen) closeLangDropdown();
      else openLangDropdown();
    });

    langPanel.querySelectorAll('.edb-lang-item').forEach((item) => {
      item.addEventListener('click', () => {
        const code = item.dataset.lang;
        const flag = langBtn.querySelector('.edb-flag');
        const codeEl = langBtn.querySelector('.edb-lang-code');

        if (code === 'en-US') {
          flag.className = 'edb-flag edb-flag-us';
          codeEl.textContent = 'EN';
        }
        if (code === 'en-CA') {
          flag.className = 'edb-flag edb-flag-ca';
          codeEl.textContent = 'EN';
        }
        if (code === 'fr-CA') {
          flag.className = 'edb-flag edb-flag-ca';
          codeEl.textContent = 'FR';
        }

        // location.href = '/?lang=' + code; // для будущей интеграции
        closeLangDropdown();
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.edb-lang-dropdown')) closeLangDropdown();
    });

    if (menu) {
      menu.addEventListener('transitionend', () => {
        if (!menu.classList.contains('open')) closeLangDropdown();
      });
    }
  }
})();

// ======================
// SWIPER: КАРУСЕЛЬ ПРОДУКТОВ (myProductsSwiper) - теперь управляется через React компонент ProductsScroller
// Инициализация удалена, так как слайдер управляется через npm пакет Swiper в React
// ======================

// ======================
// SWIPER: БРЕНДЫ (edbbr2-slider) - теперь управляется через React компонент BrandsSliderMobile
// Инициализация удалена, так как слайдер управляется через npm пакет Swiper в React
// ======================

// ======================
// SWIPER: НОВОСТИ (news-cards-slider) - теперь управляется через React компонент NewsSlider
// Инициализация удалена, так как слайдер управляется через npm пакет Swiper в React
// ======================

// ======================
// ФИЛЬТРЫ (brema-filters)
// ======================

(function () {
  const openBtn = document.querySelector('.filters-toggle');
  const drawer = document.getElementById('brema-filters');
  const closeBtn = drawer ? drawer.querySelector('.close-btn') : null;
  const backdrop = document.querySelector('.filters-backdrop');

  if (!openBtn || !drawer || !backdrop) return;

  function openFilters() {
    drawer.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.documentElement.classList.add('no-scroll');
    openBtn.setAttribute('aria-expanded', 'true');
  }

  function closeFilters() {
    drawer.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.documentElement.classList.remove('no-scroll');
    openBtn.setAttribute('aria-expanded', 'false');
  }

  openBtn.addEventListener('click', openFilters);
  closeBtn && closeBtn.addEventListener('click', closeFilters);
  backdrop.addEventListener('click', closeFilters);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeFilters();
  });
})();

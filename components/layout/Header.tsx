// components/Header.tsx

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getTranslations, getCurrentLocale } from '../../lib/utils/translations';

export default function Header() {
  // Мобильное меню
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Языковой селектор (desktop)
  const [isDesktopLangOpen, setIsDesktopLangOpen] = useState(false);
  
  // Языковой селектор (mobile)
  const [isMobileLangOpen, setIsMobileLangOpen] = useState(false);
  
  // Текущий язык
  const [currentLang, setCurrentLang] = useState({ code: 'en-CA', flag: 'ca-flag', text: 'EN' });

  // Поиск (общий для desktop + mobile)
  const [searchQuery, setSearchQuery] = useState('');
  const MIN_SEARCH_LENGTH = 3;
  const router = useRouter();

  // Переводы
  const [locale, setLocale] = useState<'en-CA' | 'fr-CA' | 'en-US'>('en-CA');
  const t = getTranslations(locale);

  // Определяем текущий язык из URL или cookie при загрузке и при изменении
  useEffect(() => {
    const currentLocale = getCurrentLocale();
    setLocale(currentLocale);
    
    // Добавляем класс на body для CSS селекторов по локали
    if (currentLocale === 'fr-CA') {
      document.body.classList.add('locale-fr-CA');
      document.body.classList.remove('locale-en-CA', 'locale-en-US');
    } else if (currentLocale === 'en-US') {
      document.body.classList.add('locale-en-US');
      document.body.classList.remove('locale-en-CA', 'locale-fr-CA');
    } else {
      document.body.classList.add('locale-en-CA');
      document.body.classList.remove('locale-en-US', 'locale-fr-CA');
    }
    
    if (currentLocale === 'en-CA') {
      setCurrentLang({ code: 'en-CA', flag: 'ca-flag', text: 'EN' });
    } else if (currentLocale === 'fr-CA') {
      setCurrentLang({ code: 'fr-CA', flag: 'ca-flag', text: 'FR' });
    } else if (currentLocale === 'en-US') {
      setCurrentLang({ code: 'en-US', flag: 'us-flag', text: 'EN' });
    }
  }, [router.query.locale]);

  // Обновляем локаль при изменении cookie (для синхронизации между вкладками)
  useEffect(() => {
    const handleStorageChange = () => {
      const currentLocale = getCurrentLocale();
      setLocale(currentLocale);
    };

    window.addEventListener('storage', handleStorageChange);
    // Также проверяем при фокусе окна
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

  // Refs для кликов вне элементов
  const desktopLangRef = useRef<HTMLDivElement>(null);
  const mobileLangRef = useRef<HTMLDivElement>(null);

  // Закрытие мобильного меню при изменении размера окна
  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia('(min-width: 981px)').matches && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Блокировка скролла при открытом мобильном меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isMobileMenuOpen]);

  // Закрытие языкового меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (desktopLangRef.current && !desktopLangRef.current.contains(event.target as Node)) {
        setIsDesktopLangOpen(false);
      }
      if (mobileLangRef.current && !mobileLangRef.current.contains(event.target as Node)) {
        setIsMobileLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Закрытие по ESC
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
        if (isDesktopLangOpen) setIsDesktopLangOpen(false);
        if (isMobileLangOpen) setIsMobileLangOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, isDesktopLangOpen, isMobileLangOpen]);

  const handleLangSelect = (code: string, flag: string, text: string) => {
    setCurrentLang({ code, flag, text });
    setIsDesktopLangOpen(false);
    setIsMobileLangOpen(false);
    
    // Сохраняем в cookie (действует 1 год)
    document.cookie = `locale=${code}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
    
    // Обновляем локаль сразу для мгновенного обновления UI
    setLocale(code as 'en-CA' | 'fr-CA' | 'en-US');
    
    // Обновляем URL с параметром locale
    const currentPath = router.asPath.split('?')[0];
    const currentQuery = { ...router.query };
    currentQuery.locale = code;
    
    // Формируем URL с query параметром
    const queryString = new URLSearchParams();
    Object.keys(currentQuery).forEach(key => {
      if (currentQuery[key] && key !== 'locale') {
        queryString.append(key, String(currentQuery[key]));
      }
    });
    queryString.append('locale', code);
    
    const newUrl = `${currentPath}?${queryString.toString()}`;
    
    // Перезагружаем страницу с новым URL для применения нового языка
    window.location.href = newUrl;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMobileLangOpen) setIsMobileLangOpen(false);
  };

  // ======== ПОИСК: общая логика ========
  const handleSearchSubmit = () => {
    const value = searchQuery.trim();

    if (value.length < MIN_SEARCH_LENGTH) {
      // можно заменить на кастомный toast/inline-ошибку
      alert(`Please enter at least ${MIN_SEARCH_LENGTH} characters to search.`);
      return;
    }

    // В будущем здесь можно вместо redirect вызывать /api/search,
    // который будет дергать Strapi + SAP.
    router.push(`/search?q=${encodeURIComponent(value)}`);
  };

  const handleDesktopKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSearchSubmit();
    }
  };

  const handleMobileSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    handleSearchSubmit();
  };

  return (
    <>
      {/* Desktop header */}
      <header className="main-header">
        <div className="container header-container">
          {/* ЛОГО ПО ЦЕНТРУ */}
          <div className="logo">
            <Link href="/">
              <img
                src="https://eurodib.com/wp-content/uploads/2020/08/eurodib_grande@2x.png"
                alt="Eurodib Logo"
              />
            </Link>
          </div>

          {/* ОДНА ЛИНИЯ: ПОИСК + ИКОНКИ */}
          <div className="search-box">
            <input
              type="text"
              id="searchInput"
              placeholder={t.header.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleDesktopKeyDown}
            />
            {/* синюю кнопку поиска скрываем адаптивом; оставить для десктопа */}
            <button
              type="button"
              aria-label="Search"
              onClick={handleSearchSubmit}
            >
              <img src="/image/search-interface-symbol.png" alt="" />
            </button>
          </div>

          {/* Блоки действий сразу после search-box */}
          <div className="header-actions">
            <Link href="/sing-in" className="action" role="link" tabIndex={0}>
              <img src="/image/Layer_1(2).png" alt="Account" />
              <div className="action-text">
                <small>{t.header.myAccount}</small>
              </div>
            </Link>

            <Link href="/contact-us" className="action" role="link" tabIndex={0}>
              <img src="/image/Layer_1.svg" alt="Contact Us" />
              <div className="action-text">
                <small>{t.header.contactUs}</small>
              </div>
            </Link>

            {/* Языковой селектор (desktop) */}
            <div 
              className="language-switcher-amazon-style" 
              ref={desktopLangRef}
            >
              <div 
                className="lang-selector"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDesktopLangOpen((prev) => !prev);
                }}
                style={{ cursor: 'pointer' }}
              >
                <span className={`lang-flag ${currentLang.flag}`}></span>
                <span className="lang-text">{currentLang.text}</span>
                <span className="lang-arrow">▾</span>
              </div>

              <div 
                className="lang-menu" 
                id="langMenu"
                style={{ display: isDesktopLangOpen ? 'block' : 'none' }}
              >
                <div 
                  className="lang-option" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLangSelect('en-CA', 'ca-flag', 'EN');
                  }}
                >
                  <span className="lang-flag ca-flag"></span>
                  <span className="lang-text">EN</span>
                </div>
                <div 
                  className="lang-option" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLangSelect('fr-CA', 'ca-flag', 'FR');
                  }}
                >
                  <span className="lang-flag ca-flag"></span>
                  <span className="lang-text">FR</span>
                </div>
                <div 
                  className="lang-option" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLangSelect('en-US', 'us-flag', 'EN');
                  }}
                >
                  <span className="lang-flag us-flag"></span>
                  <span className="lang-text">EN</span>
                </div>
              </div>
            </div>

            <Link href="/cart" className="cart-img action" role="link" tabIndex={0}>
              <img src="http://localhost:1337/uploads/Cart_acaac8482d.png" alt="Cart" />
              <div className="action-text">
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Eurodib Mobile Header ===== */}
      <header id="edb-mobile" className="edb-mobile" aria-label="Eurodib mobile header">
        <div className="edb-mbar">
          <button
            id="edb-burger"
            className="edb-burger"
            aria-label="Open menu"
            aria-controls="edb-menu"
            aria-expanded={isMobileMenuOpen}
            onClick={toggleMobileMenu}
          >
            <svg viewBox="0 0 24 24" width="28" height="28" fill="#fff" aria-hidden="true">
              <rect x="3" y="6" width="18" height="2" rx="1" />
              <rect x="3" y="11" width="18" height="2" rx="1" />
              <rect x="3" y="16" width="18" height="2" rx="1" />
            </svg>
          </button>

          <a href="/" className="edb-mlogo" aria-label="Eurodib">
            <img
              src="https://eurodib.com/wp-content/uploads/2020/08/eurodib_grande@2x.png"
              alt="Eurodib"
            />
          </a>

          <div className="edb-micons">
            <Link href="/sing-in" className="edb-mico" aria-label="Account">
              <img style={{ width: '20px', height: '19px' }} src="/image/My-account-mob.png" alt="" />
            </Link>
            <Link href="/cart" className="edb-mico" aria-label="Cart">
              <img style={{ width: '20px', height: '19px' }} src="/image/Cart-mob.png" alt="" />
            </Link>
          </div>
        </div>

        {/* search pill */}
        <div className="edb-msearch">
          <form
            action="#"
            role="search"
            className="edb-msearch-form"
            onSubmit={handleMobileSubmit}
          >
            <input
              type="search"
              placeholder={t.header.searchPlaceholder}
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" aria-label="Search">
              <img
                style={{ height: '26px', width: '27px' }}
                src="/image/Magnify-glass.png"
                alt=""
              />
            </button>
          </form>
        </div>
      </header>

      {/* ===== Mobile OFFCANVAS MENU ===== */}
      <aside 
        id="edb-menu" 
        className={`edb-menu ${isMobileMenuOpen ? 'open' : ''}`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="edb-menu-scroll">
          <nav className="edb-menulist" aria-label="Mobile navigation">
            <button className="edb-mlink">{t.navigation.dishwashing}</button>
            <Link href="/archive-page" className="edb-mlink">{t.navigation.iceMachines}</Link>
            <button className="edb-mlink">{t.navigation.refrigeration}</button>
            <button className="edb-mlink">{t.navigation.cookingBaking}</button>
            <button className="edb-mlink">{t.navigation.foodPrep}</button>
            <button className="edb-mlink">{t.navigation.dessertEquipment}</button>
            <button className="edb-mlink">{t.navigation.vacuumSealing}</button>
            <Link href="/brands" className="edb-mlink">{t.navigation.brands}</Link>

            <Link className="edb-mcta" href="/contact-us">
              Contact us
            </Link>
            <Link className="edb-mcta" href="/parts-service">
              Parts and Service
            </Link>

            {/* Language block (mobile) */}
            <div className="edb-lang edb-lang-dropdown" ref={mobileLangRef}>
              <button 
                id="edb-lang-btn" 
                className="edb-lang-btn" 
                aria-expanded={isMobileLangOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMobileLangOpen((prev) => !prev);
                }}
              >
                <span className={`edb-flag edb-flag-${currentLang.flag.replace('-flag', '')}`}></span>
                <span className="edb-lang-code">{currentLang.text}</span>
              </button>

              <div 
                id="edb-lang-panel" 
                className={`edb-lang-panel ${isMobileLangOpen ? 'is-visible' : ''}`}
                hidden={!isMobileLangOpen}
              >
                <button 
                  className="edb-lang-item" 
                  data-lang="en-CA"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLangSelect('en-CA', 'ca-flag', 'EN');
                  }}
                >
                  <span className="edb-flag edb-flag-ca"></span>
                  <span className="edb-lang-code">EN</span>
                </button>
                <button 
                  className="edb-lang-item" 
                  data-lang="fr-CA"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLangSelect('fr-CA', 'ca-flag', 'FR');
                  }}
                >
                  <span className="edb-flag edb-flag-ca"></span>
                  <span className="edb-lang-code">FR</span>
                </button>
                <button 
                  className="edb-lang-item" 
                  data-lang="en-US"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLangSelect('en-US', 'us-flag', 'EN');
                  }}
                >
                  <span className="edb-flag edb-flag-us"></span>
                  <span className="edb-lang-code">EN</span>
                </button>
              </div>
            </div>
          </nav>
        </div>
      </aside>

      {/* Desktop nav */}
      <nav className="nav-bar" id="primaryNav">
        <ul className="container nav-menu">
          <li className="has-dropdown">
            <a href="#">{t.navigation.dishwashing}</a>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.undercounter}</li>
                    <li>{t.navigation.glasswashers}</li>
                    <li>{t.navigation.passThrough}</li>
                    <li>{t.navigation.potsPans}</li>
                    <li>{t.navigation.pizzaOvens}</li>
                    <li>{t.navigation.conveyor}</li>
                    <li>{t.navigation.accessories}</li>
                  </ul>
                  <img src="/image/Images menus/menus_dishwashing.png" alt="Sandwich" />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <Link href="/archive-page">{t.navigation.iceMachines}</Link>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.waterIceDispensers}</li>
                    <li>{t.navigation.iceMakers}</li>
                    <li>{t.navigation.accessories}</li>
                  </ul>
                  <img
                    src="http://eurodib.com/wp-content/uploads/2024/01/IceMachinesMenu_image.png"
                    alt="Sandwich"
                  />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <a href="#">{t.navigation.refrigeration}</a>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.juiceSlushDispensers}</li>
                    <li>{t.navigation.blastChillers}</li>
                    <li>{t.navigation.dryAgingCabinets}</li>
                    <li>{t.navigation.wineCabinets}</li>
                  </ul>
                  <img src="/image/Images menus/menus_refrigeration.png" alt="Sandwich" />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <a href="#">{t.navigation.cookingBaking}</a>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.inductionCookers}</li>
                    <li>{t.navigation.paniniGrills}</li>
                    <li>{t.navigation.convectionOvens}</li>
                    <li>{t.navigation.gyroMachines}</li>
                    <li>{t.navigation.pizzaOvens}</li>
                    <li>{t.navigation.fryers}</li>
                    <li>{t.navigation.griddles}</li>
                    <li>{t.navigation.countertops}</li>
                    <li>{t.navigation.accessories}</li>
                  </ul>
                  <img
                    src="http://eurodib.com/wp-content/uploads/2024/01/CookingBakingMenu_image.png"
                    alt="Sandwich"
                  />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <a href="#">{t.navigation.foodPrep}</a>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.slicers}</li>
                    <li>{t.navigation.foodProcessor}</li>
                    <li>{t.navigation.cutters}</li>
                    <li>{t.navigation.meatGrinders}</li>
                    <li>{t.navigation.hamburgerPress}</li>
                    <li>{t.navigation.mixers}</li>
                    <li>{t.navigation.immersion}</li>
                    <li>{t.navigation.bakeryEquipment}</li>
                    <li>{t.navigation.pizzaPrepConditioning}</li>
                  </ul>
                  <img src="/image/Images menus/menus_food prep.png" alt="Sandwich" />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <a href="#">{t.navigation.dessertEquipment}</a>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.gelatoIceCream}</li>
                    <li>{t.navigation.sorbet}</li>
                    <li>{t.navigation.waffleMakers}</li>
                    <li>{t.navigation.crepeMachines}</li>
                    <li>{t.navigation.accessories}</li>
                  </ul>
                  <img src="/image/Images menus/menus_dessert equipment.png" alt="Sandwich" />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <a href="#">{t.navigation.vacuumSealing}</a>
            <div className="dropdown-cooking-wrapper">
              <div className="dropdown-cooking">
                <div className="dropdown-cooking-content">
                  <ul>
                    <li>{t.navigation.chamberVacuum}</li>
                    <li>{t.navigation.externalVacuum}</li>
                    <li>{t.navigation.handWrappers}</li>
                    <li>{t.navigation.sousVideCooking}</li>
                    <li>{t.navigation.bags}</li>
                    <li>{t.navigation.accessories}</li>
                  </ul>
                  <img src="/image/Images menus/menus_vacuum sealing.png" alt="Sandwich" />
                </div>
              </div>
            </div>
          </li>

          <li className="has-dropdown">
            <Link href="/brands">{t.navigation.brands}</Link>
            <div className="dropdown-brands-wrapper">
              <div className="dropdown-brands">
                <ul>
                  <li>Atmovac</li>
                  <li>Brema</li>
                  <li>Cofrimell</li>
                  <li>Dito Sama</li>
                  <li>Eurodib</li>
                  <li>Gemm</li>
                  <li>Lamber</li>
                  <li>Krampouz</li>
                  <li>Louis Tellier</li>
                  <li>Nemox</li>
                  <li>Resolute</li>
                  <li>Spidocook</li>
                  <li>Unox</li>
                  <li>Visvardis</li>
                </ul>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}

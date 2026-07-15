document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const menuOverlay = document.querySelector('.menu-overlay');
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
  const heroBg = document.querySelector('.hero-bg');

  const bingoPopup = document.getElementById('bingo-popup');
  const bingoPopupDialog = bingoPopup
    ? bingoPopup.querySelector('.bingo-popup-dialog')
    : null;
  const bingoPopupClose = bingoPopup
    ? bingoPopup.querySelector('.bingo-popup-close')
    : null;

  const POPUP_STORAGE_KEY = 'gw-lehrte-bingo-popup-seen-v1';
  const POPUP_DELAY = 2000;

  let popupReturnFocusElement = null;
  let popupCloseTimer = null;

  const isMobileView = () => window.innerWidth <= 768;

  function isMenuOpen() {
    return Boolean(
      mainNav &&
      mainNav.classList.contains('active')
    );
  }

  function isPopupOpen() {
    return Boolean(
      bingoPopup &&
      bingoPopup.classList.contains('is-open')
    );
  }

  /*
   * Die Scroll-Sperre wird gemeinsam für das mobile Menü
   * und das Bingo-Pop-up verwaltet. Dadurch kann das Schließen
   * einer Komponente nicht versehentlich die andere entsperren.
   */
  function updateBodyScrollLock() {
    const shouldLock = isMenuOpen() || isPopupOpen();

    document.body.classList.toggle(
      'popup-open',
      shouldLock
    );
  }

  /*
   * MOBILE NAVIGATION
   */
  function openMenu() {
    if (!navToggle || !mainNav || !menuOverlay) {
      return;
    }

    mainNav.classList.add('active');
    menuOverlay.classList.add('active');

    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Menü schließen');
    navToggle.innerHTML =
      '<span aria-hidden="true">✕</span>';

    updateBodyScrollLock();
  }

  function closeMenu() {
    if (!navToggle || !mainNav || !menuOverlay) {
      return;
    }

    mainNav.classList.remove('active');
    menuOverlay.classList.remove('active');

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
    navToggle.innerHTML =
      '<span aria-hidden="true">☰</span>';

    updateBodyScrollLock();
  }

  function toggleMenu() {
    if (!mainNav) {
      return;
    }

    if (isMenuOpen()) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle && mainNav && menuOverlay) {
    navToggle.addEventListener('click', toggleMenu);
    menuOverlay.addEventListener('click', closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (
          isMobileView() &&
          isMenuOpen()
        ) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!isMobileView()) {
        closeMenu();
      }
    });
  }

  /*
   * BINGO-POP-UP
   */
  function hasSeenBingoPopup() {
    try {
      return (
        localStorage.getItem(POPUP_STORAGE_KEY) ===
        'true'
      );
    } catch (error) {
      /*
       * Bei blockiertem localStorage wird das Pop-up
       * in der aktuellen Sitzung trotzdem angezeigt.
       */
      return false;
    }
  }

  function markBingoPopupAsSeen() {
    try {
      localStorage.setItem(
        POPUP_STORAGE_KEY,
        'true'
      );
    } catch (error) {
      /*
       * Das Pop-up bleibt auch dann schließbar,
       * wenn localStorage vom Browser blockiert wird.
       */
    }
  }

  function openBingoPopup() {
    if (
      !bingoPopup ||
      !bingoPopupClose ||
      hasSeenBingoPopup()
    ) {
      return;
    }

    if (isMenuOpen()) {
      closeMenu();
    }

    popupReturnFocusElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    window.clearTimeout(popupCloseTimer);

    bingoPopup.hidden = false;
    bingoPopup.setAttribute(
      'aria-hidden',
      'false'
    );

    window.requestAnimationFrame(() => {
      bingoPopup.classList.add('is-open');
      updateBodyScrollLock();
      bingoPopupClose.focus();
    });
  }

  function closeBingoPopup() {
    if (!bingoPopup || !isPopupOpen()) {
      return;
    }

    markBingoPopupAsSeen();

    bingoPopup.classList.remove('is-open');
    bingoPopup.setAttribute(
      'aria-hidden',
      'true'
    );

    updateBodyScrollLock();

    /*
     * Die Verzögerung entspricht der CSS-Ausblendanimation.
     * Danach wird das Element vollständig aus dem Layout genommen.
     */
    popupCloseTimer = window.setTimeout(() => {
      bingoPopup.hidden = true;

      if (
        popupReturnFocusElement &&
        document.contains(popupReturnFocusElement)
      ) {
        popupReturnFocusElement.focus();
      }

      popupReturnFocusElement = null;
    }, 250);
  }

  function trapPopupFocus(event) {
    if (
      event.key !== 'Tab' ||
      !bingoPopup ||
      !bingoPopupDialog ||
      !isPopupOpen()
    ) {
      return;
    }

    const focusableElements =
      bingoPopupDialog.querySelectorAll(
        [
          'a[href]',
          'button:not([disabled])',
          'input:not([disabled])',
          'textarea:not([disabled])',
          'select:not([disabled])',
          '[tabindex]:not([tabindex="-1"])'
        ].join(', ')
      );

    if (!focusableElements.length) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement =
      focusableElements[
        focusableElements.length - 1
      ];

    if (
      event.shiftKey &&
      document.activeElement === firstElement
    ) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastElement
    ) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  if (bingoPopup && bingoPopupClose) {
    bingoPopupClose.addEventListener(
      'click',
      closeBingoPopup
    );

    bingoPopup.addEventListener(
      'click',
      (event) => {
        /*
         * Nur ein direkter Klick auf den abgedunkelten
         * Hintergrund schließt das Pop-up.
         */
        if (event.target === bingoPopup) {
          closeBingoPopup();
        }
      }
    );

    if (!hasSeenBingoPopup()) {
      window.setTimeout(
        openBingoPopup,
        POPUP_DELAY
      );
    }
  }

  /*
   * Gemeinsame Tastatursteuerung für Pop-up und Navigation.
   * Das Pop-up erhält bei Escape Vorrang.
   */
  document.addEventListener(
    'keydown',
    (event) => {
      if (
        event.key === 'Escape' &&
        isPopupOpen()
      ) {
        closeBingoPopup();
        return;
      }

      if (
        event.key === 'Escape' &&
        isMenuOpen()
      ) {
        closeMenu();

        if (navToggle) {
          navToggle.focus();
        }

        return;
      }

      trapPopupFocus(event);
    }
  );

  /*
   * HERO-PARALLAX
   */
  let ticking = false;

  function updateParallax() {
    if (!heroBg) {
      return;
    }

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (
      reduceMotion ||
      window.innerWidth < 768
    ) {
      heroBg.style.transform =
        'translate3d(0, 0, 0)';

      ticking = false;
      return;
    }

    const scrollY = window.scrollY;

    heroBg.style.transform =
      `translate3d(0, ${scrollY * 0.22}px, 0)`;

    ticking = false;
  }

  function requestParallaxUpdate() {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(
      updateParallax
    );

    ticking = true;
  }

  if (heroBg) {
    window.addEventListener(
      'scroll',
      requestParallaxUpdate,
      {
        passive: true
      }
    );

    window.addEventListener(
      'resize',
      requestParallaxUpdate
    );

    updateParallax();
  }

  /*
   * REVEAL-ANIMATIONEN
   */
  const revealElements =
    document.querySelectorAll('.reveal');

  if (
    'IntersectionObserver' in window &&
    revealElements.length
  ) {
    const observer =
      new IntersectionObserver(
        (entries, observerInstance) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add(
              'visible'
            );

            observerInstance.unobserve(
              entry.target
            );
          });
        },
        {
          threshold: 0.15,
          rootMargin:
            '0px 0px -50px 0px'
        }
      );

    revealElements.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElements.forEach((element) => {
      element.classList.add('visible');
    });
  }

  /*
   * ELFSIGHT
   * Lädt das Plattformskript nur einmal für
   * Instagram und den Visitor Counter.
   */
  const elfsightWidgets =
    document.querySelectorAll(
      '[class*="elfsight-app-"]'
    );

  if (!elfsightWidgets.length) {
    return;
  }

  const scriptId =
    'elfsight-platform-script';

  const existingScript =
    document.getElementById(scriptId) ||
    document.querySelector(
      'script[src^="https://elfsightcdn.com/platform.js"]'
    );

  if (existingScript) {
    return;
  }

  const elfsightScript =
    document.createElement('script');

  elfsightScript.id = scriptId;
  elfsightScript.src =
    'https://elfsightcdn.com/platform.js';
  elfsightScript.async = true;

  elfsightScript.addEventListener(
    'error',
    () => {
      const counterSection =
        document.querySelector(
          '.visitor-counter-section'
        );

      if (!counterSection) {
        return;
      }

      counterSection.classList.add(
        'has-load-error'
      );

      const counterWidget =
        counterSection.querySelector(
          '.visitor-counter-widget'
        );

      if (counterWidget) {
        counterWidget.setAttribute(
          'aria-label',
          'Der Besucherzähler konnte nicht geladen werden.'
        );
      }
    }
  );

  document.head.appendChild(
    elfsightScript
  );
});
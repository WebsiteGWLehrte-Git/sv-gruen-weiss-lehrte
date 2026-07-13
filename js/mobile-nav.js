document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.menu-overlay');
  const navLinks = mainNav ? mainNav.querySelectorAll('a') : [];
  const heroBg = document.querySelector('.hero-bg');

  const isMobileView = () => window.innerWidth <= 768;

  function openMenu() {
    if (!navToggle || !mainNav || !overlay) return;

    mainNav.classList.add('active');
    overlay.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    navToggle.setAttribute('aria-label', 'Menü schließen');
    navToggle.innerHTML = '<span aria-hidden="true">✕</span>';
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!navToggle || !mainNav || !overlay) return;

    mainNav.classList.remove('active');
    overlay.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Menü öffnen');
    navToggle.innerHTML = '<span aria-hidden="true">☰</span>';
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const isOpen = mainNav.classList.contains('active');

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  if (navToggle && mainNav && overlay) {
    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', closeMenu);

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (isMobileView() && mainNav.classList.contains('active')) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!isMobileView()) {
        closeMenu();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && mainNav.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  let ticking = false;

  function updateParallax() {
    if (!heroBg) return;

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (reduceMotion || window.innerWidth < 768) {
      heroBg.style.transform = 'translate3d(0, 0, 0)';
      ticking = false;
      return;
    }

    const scrollY = window.scrollY;
    heroBg.style.transform = `translate3d(0, ${scrollY * 0.22}px, 0)`;
    ticking = false;
  }

  function requestParallaxUpdate() {
    if (ticking) return;

    window.requestAnimationFrame(updateParallax);
    ticking = true;
  }

  if (heroBg) {
    window.addEventListener('scroll', requestParallaxUpdate, {
      passive: true
    });

    window.addEventListener('resize', requestParallaxUpdate);

    updateParallax();
  }

  const revealElements = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealElements.length) {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('visible');
          observerInstance.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
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
});
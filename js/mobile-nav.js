document.addEventListener('DOMContentLoaded', () => {
  
  // ===== Mobile Navigation =====
  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');
  const overlay = document.querySelector('.menu-overlay');
  
  // Funktion zum Umschalten
  function toggleMenu() {
    const isActive = mainNav.classList.toggle('active');
    overlay.classList.toggle('active', isActive);
    
    // Barrierefreiheit
    navToggle.setAttribute('aria-expanded', isActive);
    navToggle.textContent = isActive ? '✕' : '☰'; // Wechselt Icon
  }

  if (navToggle && mainNav && overlay) {
    navToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Menü schließen beim Klick auf Link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', toggleMenu);
    });
  }

  // ===== Performantes Parallax Scrolling =====
  const heroBg = document.querySelector('.hero-bg');
  
  if (heroBg) {
    window.addEventListener('scroll', () => {
      // Wir prüfen, ob wir im Mobile View sind (um Batterie zu sparen optional)
      // Hier einfache Logik:
      const scrollY = window.scrollY;
      
      // Nutze Transform statt background-position für 60fps
      // Faktor 0.4 bestimmt die Geschwindigkeit
      heroBg.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
    });
  }

  // ===== Intersection Observer (Scroll Reveal) =====
  const observerOptions = {
    threshold: 0.15, // 15% des Elements sichtbar
    rootMargin: "0px 0px -50px 0px"
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Nur einmal animieren
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });
});
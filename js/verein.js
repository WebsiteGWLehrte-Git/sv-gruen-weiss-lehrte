document.addEventListener("DOMContentLoaded", () => {
  
  // HINWEIS: Die Reveal-Animation wird global über mobile-nav.js gesteuert.
  // Hier kümmern wir uns nur um die spezifischen Zahlen-Animationen.

  // ===== STATS COUNTER ANIMATION =====
  const counters = document.querySelectorAll('.count');
  
  // Wir nutzen einen Observer, damit die Animation erst startet, wenn sichtbar
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        
        // Werte auslesen
        const target = +counter.getAttribute('data-target'); // "+" wandelt string in nummer
        const hasPlus = counter.getAttribute('data-plus') === "true";
        
        const duration = 2000; // 2 Sekunden Animationsdauer
        const increment = target / (duration / 16); // 60 FPS

        let currentCount = 0;

        const updateCounter = () => {
          currentCount += increment;

          if (currentCount < target) {
            // Zahl runden für saubere Anzeige
            counter.innerText = Math.ceil(currentCount);
            requestAnimationFrame(updateCounter);
          } else {
            // Ziel erreicht -> Finalen Wert setzen + optionales Plus
            counter.innerText = target + (hasPlus ? "+" : "");
          }
        };

        updateCounter();
        observer.unobserve(counter); // Nur einmal animieren
      }
    });
  }, { threshold: 0.5 }); // Startet, wenn 50% sichtbar

  counters.forEach(c => counterObserver.observe(c));
});
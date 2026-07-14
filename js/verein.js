document.addEventListener('DOMContentLoaded', () => {
  // Die Reveal-Animation wird global über mobile-nav.js gesteuert.
  // Dieses Skript enthält ausschließlich die Zahlenanimation der Statistiken.

  const counters = document.querySelectorAll('.count');

  if (!counters.length) {
    return;
  }

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  function setFinalCounterValue(counter) {
    const target = Number(counter.dataset.target);
    const hasPlus = counter.dataset.plus === 'true';

    if (!Number.isFinite(target)) {
      return;
    }

    counter.textContent = `${target}${hasPlus ? '+' : ''}`;
  }

  if (
    prefersReducedMotion ||
    !('IntersectionObserver' in window)
  ) {
    counters.forEach(setFinalCounterValue);
    return;
  }

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const counter = entry.target;
        const target = Number(counter.dataset.target);
        const hasPlus = counter.dataset.plus === 'true';

        if (!Number.isFinite(target)) {
          observer.unobserve(counter);
          return;
        }

        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          const currentValue = Math.round(target * progress);

          counter.textContent = String(currentValue);

          if (progress < 1) {
            window.requestAnimationFrame(updateCounter);
            return;
          }

          counter.textContent = `${target}${hasPlus ? '+' : ''}`;
        }

        window.requestAnimationFrame(updateCounter);
        observer.unobserve(counter);
      });
    },
    {
      threshold: 0.25
    }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
});
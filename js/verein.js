// ===== Timeline Animation =====
document.addEventListener("DOMContentLoaded", () => {
  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  reveals.forEach(el => observer.observe(el));

});

// ===== STATS Animation =====

const counters = document.querySelectorAll('.count');

const options = {
  threshold: 0.5
};

const counterObserver = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      let count = 0;
      const duration = 1500; // Dauer in ms
      const increment = target / (duration / 16); // ~60fps

      const updateCount = () => {
        count += increment;
        if(count >= target) count = target;

        // Für alle Counter ein Plus anhängen, wenn Ziel erreicht
        el.textContent = Math.floor(count) + (count === target ? " +" : "");

        if(count < target) {
          requestAnimationFrame(updateCount);
        }
      };

      updateCount();
      observer.unobserve(el);
    }
  });
}, options);

counters.forEach(counter => counterObserver.observe(counter));
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('news-modal');
  const modalClose = document.querySelector('.modal-close');
  
  // Elemente im Modal
  const modalImg = document.getElementById('modal-image');
  const modalDate = document.getElementById('modal-date');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');

  // === ROBUSTE KLICK-ERKENNUNG (Event Delegation) ===
  // Wir hören auf Klicks auf der GANZEN Seite. Das fixt das iPhone-Problem.
  document.addEventListener('click', (e) => {
    
    // Prüfen: Wurde ein Element mit der Klasse "news-link" (oder dessen Kinder) geklickt?
    const link = e.target.closest('.news-link');

    if (link) {
      e.preventDefault(); // Verhindert das Springen nach oben

      // Daten auslesen
      const image = link.getAttribute('data-image');
      const date = link.getAttribute('data-date');
      const category = link.getAttribute('data-category');
      const title = link.getAttribute('data-title');
      const description = link.getAttribute('data-description');

      // Modal befüllen
      if(modalImg) modalImg.src = image;
      if(modalDate) modalDate.textContent = date;
      if(modalCategory) modalCategory.textContent = category;
      if(modalTitle) modalTitle.textContent = title;
      if(modalText) modalText.innerHTML = description; 

      // Modal öffnen
      if(modal) modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Scrollen der Seite sperren
    }
  });

  // === SCHLIEßEN LOGIK ===
  const closeModal = () => {
    if(modal) modal.classList.remove('active');
    document.body.style.overflow = ''; // Scrollen wieder erlauben
  };

  // Klick auf X
  if(modalClose) modalClose.addEventListener('click', closeModal);

  // Klick auf den Hintergrund (Overlay)
  if(modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // ESC Taste
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
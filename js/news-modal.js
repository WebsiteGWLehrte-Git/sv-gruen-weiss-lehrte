document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('news-modal');
  const modalClose = document.querySelector('.modal-close');
  const newsLinks = document.querySelectorAll('.news-link');

  // Modal Elemente zum Befüllen
  const modalImg = document.getElementById('modal-image');
  const modalDate = document.getElementById('modal-date');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');

  // Öffnen
  newsLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Verhindert das Neuladen der Seite

      // Daten aus den Attributen holen
      const image = link.getAttribute('data-image');
      const date = link.getAttribute('data-date');
      const category = link.getAttribute('data-category');
      const title = link.getAttribute('data-title');
      const description = link.getAttribute('data-description');

      // Modal befüllen
      modalImg.src = image;
      modalDate.textContent = date;
      modalCategory.textContent = category;
      modalTitle.textContent = title;
      // innerHTML statt textContent, damit wir <br> nutzen können
      modalText.innerHTML = description; 

      // Modal anzeigen
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Scrollen im Hintergrund verhindern
    });
  });

  // Schließen Funktion
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Scrollen wieder erlauben
  };

  // Klick auf X
  modalClose.addEventListener('click', closeModal);

  // Klick neben das Modal (auf den dunklen Hintergrund)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Schließen mit ESC-Taste
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('news-modal');
  const modalContent = modal ? modal.querySelector('.modal-content') : null;
  const modalClose = document.querySelector('.modal-close');

  const modalImg = document.getElementById('modal-image');
  const modalDate = document.getElementById('modal-date');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalText = document.getElementById('modal-text');

  let lastTrigger = null;

  function openModal(link) {
    if (!modal || !modalContent) return;

    const image = link.getAttribute('data-image') || '';
    const date = link.getAttribute('data-date') || '';
    const category = link.getAttribute('data-category') || '';
    const title = link.getAttribute('data-title') || '';
    const description = link.getAttribute('data-description') || '';

    if (modalImg) {
      const normalizedImage = image.replace(/\\/g, '/');
      modalImg.src = normalizedImage;
      modalImg.alt = title ? `Beitragsbild zu ${title}` : '';

      modalImg.onerror = () => {
        modalImg.src = 'assets/images/fallback-news.jpg';
        modalImg.alt = 'Kein Bild verfügbar';
      };
    }

    if (modalDate) modalDate.textContent = date;
    if (modalCategory) modalCategory.textContent = category;
    if (modalTitle) modalTitle.textContent = title;
    if (modalText) modalText.innerHTML = description;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    lastTrigger = link;
    modalContent.focus();
  }

  function closeModal() {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    if (modalImg) {
      modalImg.src = '';
      modalImg.alt = '';
    }

    if (lastTrigger) {
      lastTrigger.focus();
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.news-link');

    if (link) {
      e.preventDefault();
      openModal(link);
      return;
    }

    if (e.target === modal) {
      closeModal();
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
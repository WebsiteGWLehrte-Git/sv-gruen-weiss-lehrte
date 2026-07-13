document.addEventListener('DOMContentLoaded', () => {
  const previewImages = document.querySelectorAll(
    '[data-image-preview]'
  );

  const lightbox = document.getElementById('image-lightbox');
  const lightboxPreview = document.getElementById(
    'image-lightbox-preview'
  );

  if (
    !previewImages.length ||
    !lightbox ||
    !lightboxPreview
  ) {
    return;
  }

  const closeTriggers = lightbox.querySelectorAll(
    '[data-lightbox-close]'
  );

  const closeButton = lightbox.querySelector(
    '.image-lightbox-close'
  );

  let lastFocusedElement = null;
  let previousBodyOverflow = '';

  function openLightbox(src, alt) {
    if (!src) {
      return;
    }

    lastFocusedElement = document.activeElement;
    previousBodyOverflow = document.body.style.overflow;

    lightboxPreview.src = src;
    lightboxPreview.alt = alt || '';

    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');

    document.body.style.overflow = 'hidden';

    if (closeButton) {
      closeButton.focus();
    }
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('is-open')) {
      return;
    }

    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');

    lightboxPreview.src = '';
    lightboxPreview.alt = '';

    document.body.style.overflow = previousBodyOverflow;

    if (
      lastFocusedElement instanceof HTMLElement &&
      document.contains(lastFocusedElement)
    ) {
      lastFocusedElement.focus();
    }

    lastFocusedElement = null;
  }

  previewImages.forEach((image) => {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute(
      'aria-label',
      `${image.alt || 'Mannschaftsbild'} vergrößern`
    );

    image.addEventListener('click', () => {
      openLightbox(
        image.dataset.imagePreview,
        image.alt
      );
    });

    image.addEventListener('keydown', (event) => {
      if (
        event.key !== 'Enter' &&
        event.key !== ' '
      ) {
        return;
      }

      event.preventDefault();

      openLightbox(
        image.dataset.imagePreview,
        image.alt
      );
    });
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener('click', closeLightbox);
  });

  document.addEventListener('keydown', (event) => {
    if (
      event.key === 'Escape' &&
      lightbox.classList.contains('is-open')
    ) {
      event.preventDefault();
      closeLightbox();
    }
  });
});
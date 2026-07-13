document.addEventListener('DOMContentLoaded', () => {
  const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
  const modals = document.querySelectorAll(
    '.modal-overlay[role="dialog"]'
  );

  if (!modalOpenButtons.length || !modals.length) {
    return;
  }

  const focusableSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  let activeModal = null;
  let lastTrigger = null;
  let previousBodyOverflow = '';

  function getFocusableElements(modal) {
    return Array.from(
      modal.querySelectorAll(focusableSelector)
    ).filter((element) => {
      return (
        !element.hasAttribute('hidden') &&
        element.getAttribute('aria-hidden') !== 'true'
      );
    });
  }

  function openModal(modalId, trigger) {
    const modal = document.getElementById(modalId);

    if (!modal || !modal.matches('.modal-overlay[role="dialog"]')) {
      return;
    }

    if (activeModal && activeModal !== modal) {
      closeModal(activeModal, false);
    }

    const modalContent = modal.querySelector('.modal-content');

    if (!modalContent) {
      return;
    }

    lastTrigger = trigger || document.activeElement;
    activeModal = modal;
    previousBodyOverflow = document.body.style.overflow;

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    window.requestAnimationFrame(() => {
      const closeButton = modal.querySelector('[data-modal-close]');

      if (closeButton) {
        closeButton.focus();
      } else {
        modalContent.focus();
      }
    });
  }

  function closeModal(modal, restoreFocus = true) {
    if (!modal) {
      return;
    }

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    if (activeModal === modal) {
      activeModal = null;
    }

    const anotherOpenModal = document.querySelector(
      '.modal-overlay.active[role="dialog"]'
    );

    if (!anotherOpenModal) {
      document.body.style.overflow = previousBodyOverflow;
    }

    if (
      restoreFocus &&
      lastTrigger instanceof HTMLElement &&
      document.contains(lastTrigger)
    ) {
      lastTrigger.focus();
    }

    if (restoreFocus) {
      lastTrigger = null;
    }
  }

  function trapFocus(event) {
    if (!activeModal || event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements(activeModal);

    if (!focusableElements.length) {
      event.preventDefault();

      const modalContent = activeModal.querySelector('.modal-content');

      if (modalContent) {
        modalContent.focus();
      }

      return;
    }

    const firstFocusable = focusableElements[0];
    const lastFocusable =
      focusableElements[focusableElements.length - 1];

    if (
      event.shiftKey &&
      document.activeElement === firstFocusable
    ) {
      event.preventDefault();
      lastFocusable.focus();
      return;
    }

    if (
      !event.shiftKey &&
      document.activeElement === lastFocusable
    ) {
      event.preventDefault();
      firstFocusable.focus();
    }
  }

  modalOpenButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.dataset.modalOpen;

      if (modalId) {
        openModal(modalId, button);
      }
    });
  });

  modals.forEach((modal) => {
    const closeButtons = modal.querySelectorAll('[data-modal-close]');

    closeButtons.forEach((button) => {
      button.addEventListener('click', () => {
        closeModal(modal);
      });
    });

    modal.addEventListener('mousedown', (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (!activeModal) {
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeModal(activeModal);
      return;
    }

    trapFocus(event);
  });
});
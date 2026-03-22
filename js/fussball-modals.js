document.addEventListener('DOMContentLoaded', () => {
  const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
  const modalCloseButtons = document.querySelectorAll('[data-modal-close]');
  const modals = document.querySelectorAll('.modal-overlay[role="dialog"]');

  let lastTrigger = null;

  function openModal(modalId, trigger = null) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const modalContent = modal.querySelector('.modal-content');

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    lastTrigger = trigger;

    if (modalContent) {
      modalContent.focus();
    }
  }

  function closeModal(modal) {
    if (!modal) return;

    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');

    const anyOpenModal = document.querySelector('.modal-overlay.active');
    if (!anyOpenModal) {
      document.body.style.overflow = '';
    }

    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  }

  modalOpenButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modalId = button.getAttribute('data-modal-open');
      openModal(modalId, button);
    });
  });

  modalCloseButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal-overlay');
      closeModal(modal);
    });
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach((modal) => {
        closeModal(modal);
      });
    }
  });
});
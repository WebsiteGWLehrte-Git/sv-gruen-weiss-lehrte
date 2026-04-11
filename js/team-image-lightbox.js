document.addEventListener("DOMContentLoaded", () => {
  const previewImages = document.querySelectorAll("[data-image-preview]");
  const lightbox = document.getElementById("image-lightbox");
  const lightboxPreview = document.getElementById("image-lightbox-preview");
  const closeTriggers = document.querySelectorAll("[data-lightbox-close]");

  if (!previewImages.length || !lightbox || !lightboxPreview) return;

  let lastFocusedElement = null;

  const openLightbox = (src, alt) => {
    lastFocusedElement = document.activeElement;
    lightboxPreview.src = src;
    lightboxPreview.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxPreview.src = "";
    lightboxPreview.alt = "";
    document.body.style.overflow = "";

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  };

  previewImages.forEach((image) => {
    image.addEventListener("click", () => {
      openLightbox(image.dataset.imagePreview, image.alt);
    });

    image.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(image.dataset.imagePreview, image.alt);
      }
    });

    image.setAttribute("tabindex", "0");
  });

  closeTriggers.forEach((trigger) => {
    trigger.addEventListener("click", closeLightbox);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
      closeLightbox();
    }
  });
});
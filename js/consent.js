document.addEventListener("DOMContentLoaded", () => {
  const STORAGE_KEY = "gwl_consent_v1";

  const banner = document.getElementById("consent-banner");
  const externalCheckbox = document.getElementById("consent-external");
  const rejectBtn = document.getElementById("consent-reject");
  const saveBtn = document.getElementById("consent-save");
  const acceptBtn = document.getElementById("consent-accept");

  function readConsent() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
    } catch {
      return null;
    }
  }

  function writeConsent(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function closeBanner() {
    if (banner) banner.hidden = true;
    document.body.classList.remove("consent-open");
  }

  function openBanner() {
    if (banner) banner.hidden = false;
    document.body.classList.add("consent-open");
  }

  function applyExternalEmbeds(consent) {
    if (!consent?.external) return;

    document
      .querySelectorAll('[data-consent-category="external"][data-src]')
      .forEach((wrapper) => {
        if (wrapper.dataset.loaded === "true") return;

        const iframe = document.createElement("iframe");
        iframe.src = wrapper.dataset.src;
        iframe.loading = "lazy";
        iframe.referrerPolicy = "no-referrer-when-downgrade";
        iframe.allowFullscreen = true;
        iframe.title = wrapper.dataset.embedType || "Externer Inhalt";

        wrapper.innerHTML = "";
        wrapper.appendChild(iframe);
        wrapper.dataset.loaded = "true";
      });

    document
      .querySelectorAll('[data-consent-category="external"][data-script-src]')
      .forEach((node) => {
        if (node.dataset.loaded === "true") return;

        const script = document.createElement("script");
        script.src = node.dataset.scriptSrc;
        script.async = true;
        document.body.appendChild(script);

        node.dataset.loaded = "true";
      });
  }

  function setConsent(consent) {
    writeConsent(consent);
    closeBanner();
    applyExternalEmbeds(consent);
  }

  const saved = readConsent();

  if (!saved) {
    openBanner();
  } else {
    if (externalCheckbox) {
      externalCheckbox.checked = !!saved.external;
    }
    applyExternalEmbeds(saved);
  }

  rejectBtn?.addEventListener("click", () => {
    setConsent({ essential: true, external: false, ts: Date.now() });
  });

  saveBtn?.addEventListener("click", () => {
    setConsent({
      essential: true,
      external: !!externalCheckbox?.checked,
      ts: Date.now(),
    });
  });

  acceptBtn?.addEventListener("click", () => {
    if (externalCheckbox) {
      externalCheckbox.checked = true;
    }
    setConsent({ essential: true, external: true, ts: Date.now() });
  });

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest(".consent-load-external");
    if (!trigger) return;

    setConsent({ essential: true, external: true, ts: Date.now() });
  });

  document.querySelectorAll("[data-open-consent-settings]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const consent = readConsent();
      if (externalCheckbox && consent) {
        externalCheckbox.checked = !!consent.external;
      }

      openBanner();
    });
  });

  banner?.addEventListener("click", (event) => {
    if (event.target === banner) {
      closeBanner();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && banner && !banner.hidden) {
      closeBanner();
    }
  });
});
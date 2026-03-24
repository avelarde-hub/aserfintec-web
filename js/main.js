document.addEventListener("DOMContentLoaded", () => {

  const header = document.querySelector(".topbar");
  const whatsappFloat = document.querySelector(".whatsapp-float");

  const revealElements = document.querySelectorAll(
    ".hero-card, .card, .method-card, .value-card, .industry-card, .feature-copy, .image-tile, .contact-card, .cta-box"
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
  });

  const revealOnScroll = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  revealElements.forEach((element) => {
    revealOnScroll.observe(element);
  });

  const toggleHeaderStyle = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  toggleHeaderStyle();
  window.addEventListener("scroll", toggleHeaderStyle);

  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      trackEvent("click_navegacion_interna", {
        event_category: "navegacion",
        event_label: targetId,
      });
    });
  });

  if (whatsappFloat) {
    whatsappFloat.style.opacity = "0";
    whatsappFloat.style.transform = "translateY(16px)";
    whatsappFloat.style.transition = "opacity 0.5s ease, transform 0.5s ease";

    setTimeout(() => {
      whatsappFloat.style.opacity = "1";
      whatsappFloat.style.transform = "translateY(0)";
    }, 900);
  }

  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');
  whatsappLinks.forEach((link) => {
    link.addEventListener("click", () => {
      trackEvent("click_whatsapp", {
        event_category: "contacto",
        event_label: link.classList.contains("whatsapp-float")
          ? "boton_whatsapp_flotante"
          : "boton_whatsapp_contacto",
      });
    });
  });

  const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
  emailLinks.forEach((link) => {
    link.addEventListener("click", () => {
      trackEvent("click_email", {
        event_category: "contacto",
        event_label: "correo_contacto",
      });
    });
  });

  const primaryButtons = document.querySelectorAll(".btn-primary, .btn-secondary");
  primaryButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const label = button.textContent.trim().toLowerCase().replace(/\s+/g, "_");

      trackEvent("click_boton", {
        event_category: "interaccion",
        event_label: label,
      });
    });
  });

  function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }
});


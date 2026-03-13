document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".topbar");
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
    });
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const EMAILJS_PUBLIC_KEY = "5-A5vlAWko_mEhev2"; // Public Key from EmailJS Account -> General
  const EMAILJS_SERVICE_ID = "service_va0bgpj"; // Your EmailJS Service ID
  const EMAILJS_TEMPLATE_ID = "template_mg136jl"; // Your EmailJS Template ID
  const RECAPTCHA_SITE_KEY = "RECAPTCHA_SITE_KEY_AQUI"; // ReCAPTCHA v3 Site Key

  const recaptchaPromise = RECAPTCHA_SITE_KEY !== "RECAPTCHA_SITE_KEY_AQUI"
    ? new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("No se pudo cargar reCAPTCHA."));
        document.head.appendChild(script);
      })
    : Promise.resolve();

  if (EMAILJS_SERVICE_ID === "SERVICE_ID_AQUI" || EMAILJS_TEMPLATE_ID === "TEMPLATE_ID_AQUI") {
    console.error("EmailJS no puede enviar porque Service ID o Template ID no están configurados. Actualiza js/main.js con los valores reales.");
  }

  if (window.emailjs && typeof emailjs.init === "function") {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  } else {
    console.error("EmailJS no se cargó correctamente. Revisa la carga del script de EmailJS.");
  }

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

  // Contact Form Handler with State Management
  class ContactFormState {
    constructor(formElement) {
      this.form = formElement;
      this.state = {
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        message: "",
        consent: false,
        errors: {},
        isSubmitting: false,
        submitted: false,
      };

      this.inputs = {
        name: formElement.querySelector("#formName"),
        email: formElement.querySelector("#formEmail"),
        company: formElement.querySelector("#formCompany"),
        phone: formElement.querySelector("#formPhone"),
        service: formElement.querySelector("#formService"),
        message: formElement.querySelector("#formMessage"),
        consent: formElement.querySelector("#formConsent"),
        honeypot: formElement.querySelector("#formBotField"),
      };

      this.statusDiv = formElement.querySelector("#formStatus");
      this.submitBtn = formElement.querySelector(".form-submit");
      this.toast = document.getElementById("toastMessage");

      this.init();
    }

    init() {
      // Bind input change events
      Object.entries(this.inputs).forEach(([key, input]) => {
        if (!input) return;

        input.addEventListener("change", (e) => {
          this.setState(key, e.target.type === "checkbox" ? e.target.checked : e.target.value);
        });

        input.addEventListener("input", (e) => {
          this.setState(key, e.target.type === "checkbox" ? e.target.checked : e.target.value);
          this.clearError(key);
        });
      });

      // Bind form submission
      this.form.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleSubmit();
      });
    }

    setState(key, value) {
      this.state[key] = value;
      if (this.inputs[key]) {
        this.inputs[key].value = value;
      }
    }

    clearError(key) {
      const errorElement = document.getElementById(`${key}Error`);
      if (errorElement) {
        errorElement.textContent = "";
      }
      if (this.inputs[key]) {
        this.inputs[key].classList.remove("is-invalid");
      }
    }

    setError(key, message) {
      this.state.errors[key] = message;
      const errorElement = document.getElementById(`${key}Error`);
      if (errorElement) {
        errorElement.textContent = message;
      }
      if (this.inputs[key]) {
        this.inputs[key].classList.add("is-invalid");
      }
    }

    validate() {
      this.state.errors = {};
      let isValid = true;

      // Name validation
      if (!this.state.name.trim()) {
        this.setError("name", "El nombre es requerido");
        isValid = false;
      } else if (this.state.name.trim().length < 3) {
        this.setError("name", "El nombre debe tener al menos 3 caracteres");
        isValid = false;
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!this.state.email.trim()) {
        this.setError("email", "El correo es requerido");
        isValid = false;
      } else if (!emailRegex.test(this.state.email)) {
        this.setError("email", "Ingresa un correo válido");
        isValid = false;
      }

      // Service validation
      if (!this.state.service.trim()) {
        this.setError("service", "Selecciona un servicio");
        isValid = false;
      }

      // Company validation (optional)
      if (this.state.company.trim() && this.state.company.trim().length < 2) {
        this.setError("company", "Introduce el nombre de la empresa o deja el campo vacío");
        isValid = false;
      }

      // Phone validation (optional)
      if (this.state.phone.trim()) {
        const phonePattern = /^[0-9+()\s-]{7,20}$/;
        if (!phonePattern.test(this.state.phone.trim())) {
          this.setError("phone", "Ingresa un teléfono válido");
          isValid = false;
        }
      }

      // Message validation
      if (!this.state.message.trim()) {
        this.setError("message", "Cuéntanos sobre tu necesidad");
        isValid = false;
      } else if (this.state.message.trim().length < 10) {
        this.setError("message", "El mensaje debe tener al menos 10 caracteres");
        isValid = false;
      }

      // Consent validation
      if (!this.state.consent) {
        this.setError("consent", "Debes aceptar la política de privacidad");
        isValid = false;
      }

      // Honeypot anti-spam validation
      if (this.inputs.honeypot && this.inputs.honeypot.value.trim()) {
        this.showError("Spam detectado. Por favor, intenta nuevamente.");
        isValid = false;
      }

      return isValid;
    }

    async handleSubmit() {
      this.state.isSubmitting = true;
      this.submitBtn.disabled = true;
      this.submitBtn.textContent = "Enviando...";
      this.statusDiv.className = "form-status";
      this.statusDiv.textContent = "";

      if (!this.validate()) {
        this.state.isSubmitting = false;
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = "Enviar solicitud";
        return;
      }

      try {
        const recaptchaToken = await this.getRecaptchaToken();

        const templateParams = {
          from_name: this.state.name,
          from_email: this.state.email,
          company: this.state.company,
          phone: this.state.phone,
          service: this.state.service,
          message: this.state.message,
          to_email: "aserfintec@hotmail.com",
          reply_to: this.state.email, // Para que puedas responder directamente al cliente
          recaptcha_token: recaptchaToken || "",
        };

        if (!window.emailjs || typeof emailjs.send !== "function") {
          throw new Error("EmailJS no está disponible. Verifica la carga del script.");
        }

        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          templateParams
        );

        trackEvent("contactform_submit", {
          event_category: "contacto",
          event_label: this.state.service,
        });

        this.showSuccess(
          "✓ Tu solicitud ha sido enviada exitosamente. Nos contactaremos en las próximas 24 horas."
        );
        this.showToast("Solicitud enviada. Revisa tu bandeja de entrada y gracias por contactarnos.", "success");

        setTimeout(() => {
          this.resetForm();
        }, 2000);
      } catch (error) {
        console.error("Form submission error:", error);
        const message = error && error.text ? error.text : error.message || "Error desconocido al enviar el formulario.";
        this.showError(
          `✕ Ha ocurrido un error al enviar el correo: ${message}. Por favor, intenta nuevamente o contáctanos directamente.`
        );
        trackEvent("contactform_error", {
          event_category: "contacto",
          event_label: this.state.service || "sin_servicio",
          error_message: message,
        });
      } finally {
        this.state.isSubmitting = false;
        this.submitBtn.disabled = false;
        this.submitBtn.textContent = "Enviar solicitud";
      }
    }

    showSuccess(message) {
      this.statusDiv.className = "form-status success";
      this.statusDiv.textContent = message;
      this.state.submitted = true;
    }

    showError(message) {
      this.statusDiv.className = "form-status error";
      this.statusDiv.textContent = message;
      this.showToast(message, "error");
    }

    showToast(message, type = "success") {
      if (!this.toast) return;
      this.toast.textContent = message;
      this.toast.className = `toast show ${type}`;
      clearTimeout(this.toastTimeout);
      this.toastTimeout = setTimeout(() => {
        this.toast.classList.remove("show");
      }, 5200);
    }

    async getRecaptchaToken() {
      if (RECAPTCHA_SITE_KEY === "RECAPTCHA_SITE_KEY_AQUI") {
        return null;
      }

      try {
        await recaptchaPromise;
        if (typeof grecaptcha === "undefined" || !grecaptcha.execute) {
          console.warn("reCAPTCHA no está disponible.");
          return null;
        }
        return await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "contact" });
      } catch (error) {
        console.warn("No se pudo obtener el token de reCAPTCHA:", error);
        return null;
      }
    }

    resetForm() {
      this.form.reset();
      this.state = {
        name: "",
        email: "",
        company: "",
        phone: "",
        service: "",
        message: "",
        consent: false,
        errors: {},
        isSubmitting: false,
        submitted: false,
      };
      this.statusDiv.className = "form-status";
      this.statusDiv.textContent = "";
    }
  }

  // Initialize form
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    new ContactFormState(contactForm);
  }

  function trackEvent(eventName, params = {}) {
    if (typeof window.gtag === "function") {
      window.gtag("event", eventName, params);
    }
  }
});


/* ==========================================================================
   Hassan — Portfolio scripts
   1. Theme switcher (localStorage)
   2. Mobile menu
   3. Typing effect
   4. Smooth scroll + active link
   5. Header scroll state + scroll reveals
   6. Form validation
   7. Footer year
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ========================================================================
     1. THEME SWITCHER
     ====================================================================== */

  const body = document.body;
  const themeToggle = document.getElementById('themeToggle');
  const STORAGE_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    const isLight = theme === 'light';

    body.classList.toggle('light-theme', isLight);
    document.documentElement.setAttribute('data-theme', isLight ? 'light' : 'dark');

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute(
        'aria-label',
        isLight ? 'Switch to dark theme' : 'Switch to light theme'
      );
    }
  }

  function readStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* Storage unavailable (private mode) — the theme still applies for this visit. */
    }
  }

  const storedTheme = readStoredTheme();
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

  applyTheme(storedTheme || (prefersLight ? 'light' : 'dark'));

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const nextTheme = body.classList.contains('light-theme') ? 'dark' : 'light';
      applyTheme(nextTheme);
      storeTheme(nextTheme);
    });
  }

  /* ========================================================================
     2. MOBILE MENU
     ====================================================================== */

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const menuBackdrop = document.getElementById('menuBackdrop');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    hamburger.classList.add('is-active');
    hamburger.setAttribute('aria-expanded', 'true');
    hamburger.setAttribute('aria-label', 'Close menu');
    menuBackdrop.classList.add('is-visible');
    body.classList.add('menu-open');
  }

  function closeMenu() {
    if (!mobileMenu) return;
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.classList.remove('is-active');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Open menu');
    menuBackdrop.classList.remove('is-visible');
    body.classList.remove('menu-open');
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (menuBackdrop) {
    menuBackdrop.addEventListener('click', closeMenu);
  }

  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) {
      closeMenu();
    }
  });

  /* ========================================================================
     3. TYPING EFFECT
     ====================================================================== */

  const typedEl = document.getElementById('typedText');
  const roles = ['Frontend Developer', 'Flutter Engineer', 'Problem Solver'];

  const TYPE_SPEED = 75;
  const DELETE_SPEED = 40;
  const HOLD_FULL = 1600;
  const HOLD_EMPTY = 320;

  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function typeLoop() {
    if (!typedEl) return;

    const current = roles[roleIndex];

    if (deleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typedEl.textContent = current.slice(0, charIndex);

    let delay = deleting ? DELETE_SPEED : TYPE_SPEED;

    if (!deleting && charIndex === current.length) {
      deleting = true;
      delay = HOLD_FULL;
    } else if (deleting && charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = HOLD_EMPTY;
    }

    window.setTimeout(typeLoop, delay);
  }

  if (typedEl) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      typedEl.textContent = roles[0];
    } else {
      typeLoop();
    }
  }

  /* ========================================================================
     4. SMOOTH SCROLL + ACTIVE LINK
     ====================================================================== */

  const header = document.getElementById('siteHeader');
  const anchorLinks = document.querySelectorAll('a[href^="#"]');

  anchorLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      const targetId = link.getAttribute('href');

      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight + 1;

      window.scrollTo({
        top: top,
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
  });

  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function setActiveLink() {
    const offset = (header ? header.offsetHeight : 0) + 40;
    let currentId = '';

    sections.forEach(function (section) {
      if (window.pageYOffset >= section.offsetTop - offset) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      const isActive = link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', isActive);
    });
  }

  /* ========================================================================
     5. HEADER SCROLL STATE + SCROLL REVEALS
     ====================================================================== */

  function setHeaderState() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.pageYOffset > 8);
  }

  let ticking = false;

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;

    window.requestAnimationFrame(function () {
      setHeaderState();
      setActiveLink();
      ticking = false;
    });
  });

  setHeaderState();
  setActiveLink();

  const revealTargets = document.querySelectorAll(
    '.section-head, .about-text, .skills, .project-card, .contact-form'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) {
      el.classList.add('will-reveal');
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ========================================================================
     6. FORM VALIDATION
     ====================================================================== */

  const form = document.getElementById('contactForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const messageInput = document.getElementById('message');
  const formStatus = document.getElementById('formStatus');

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  function showError(input, errorId, text) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = text;
    input.closest('.field').classList.add('has-error');
    input.setAttribute('aria-invalid', 'true');
  }

  function clearError(input, errorId) {
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = '';
    input.closest('.field').classList.remove('has-error');
    input.removeAttribute('aria-invalid');
  }

  function validateName() {
    const value = nameInput.value.trim();

    if (value === '') {
      showError(nameInput, 'nameError', 'Enter your name so I know who I\u2019m replying to.');
      return false;
    }

    clearError(nameInput, 'nameError');
    return true;
  }

  function validateEmail() {
    const value = emailInput.value.trim();

    if (value === '') {
      showError(emailInput, 'emailError', 'Enter an email address.');
      return false;
    }

    if (!EMAIL_PATTERN.test(value)) {
      showError(emailInput, 'emailError', 'That email doesn\u2019t look right — check for a typo.');
      return false;
    }

    clearError(emailInput, 'emailError');
    return true;
  }

  function validateMessage() {
    const value = messageInput.value.trim();

    if (value === '') {
      showError(messageInput, 'messageError', 'Add a message, even a short one.');
      return false;
    }

    if (value.length < 10) {
      showError(messageInput, 'messageError', 'A little more detail helps — 10 characters minimum.');
      return false;
    }

    clearError(messageInput, 'messageError');
    return true;
  }

  if (form) {
    nameInput.addEventListener('blur', validateName);
    emailInput.addEventListener('blur', validateEmail);
    messageInput.addEventListener('blur', validateMessage);

    nameInput.addEventListener('input', function () {
      if (nameInput.closest('.field').classList.contains('has-error')) validateName();
    });

    emailInput.addEventListener('input', function () {
      if (emailInput.closest('.field').classList.contains('has-error')) validateEmail();
    });

    messageInput.addEventListener('input', function () {
      if (messageInput.closest('.field').classList.contains('has-error')) validateMessage();
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      const validName = validateName();
      const validEmail = validateEmail();
      const validMessage = validateMessage();

      if (!validName || !validEmail || !validMessage) {
        if (formStatus) formStatus.textContent = '';

        const firstInvalid = form.querySelector('.field.has-error .field-input');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      /* Replace this block with a real submission (fetch to your backend,
         Formspree, EmailJS, etc.) when the site goes live. */
      window.alert('Message sent successfully!');

      if (formStatus) {
        formStatus.textContent = 'Message sent. I\u2019ll get back to you within a day or two.';
      }

      form.reset();
    });
  }

  /* ========================================================================
     7. FOOTER YEAR
     ====================================================================== */

  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }
});

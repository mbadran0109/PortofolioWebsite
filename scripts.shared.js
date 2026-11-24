/*
  scripts.shared.js - Shared JavaScript for Mohamed Badran portfolio site

  Responsibilities:
    1. Render shared site sections (navigation, service switcher, contact form, footer)
    2. Handle accessible mobile navigation & homepage scrollspy
    3. Animate fade-up elements & reveal cards via IntersectionObserver
    4. Handle collapsible service & timeline cards with dynamic button labels
    5. Provide an interactive media gallery lightbox for project/service photos
    6. Load EmailJS v4 on demand and handle contact form submissions with fallback

  Load this file on every page with `defer`. Set `data-root="."` (home) or
  `data-root="../.."` (service pages) on `<body>`.
*/

(function () {
  'use strict';

  const SITE_CONFIG = {
    name: 'Mohamed Badran',
    email: 'mbadran0109@gmail.com',
    location: 'Alexandria, Egypt',
    copyrightYear: 2026,
    services: [
      { slug: 'software-ai', name: 'Software, AI & Data Science' },
      { slug: 'robotics-embedded', name: 'Robotics & Embedded Systems' },
      { slug: 'steam-education', name: 'STEAM Education & Coaching' },
      { slug: 'competitions-judging', name: 'Robotics Competitions & Judging' },
      { slug: 'it-infrastructure', name: 'IT Infrastructure & Maintenance' },
      { slug: 'industrial-3d', name: 'Industrial Engineering & 3D Design' },
      { slug: 'project-leadership', name: 'Project, Event & Team Leadership' }
    ],
    socials: [
      { cls: 'fb', label: 'Facebook', href: 'https://facebook.com/mbadran0109' },
      { cls: 'ig', label: 'Instagram', href: 'https://instagram.com/mbadran0109' },
      { cls: 'li', label: 'LinkedIn', href: 'https://linkedin.com/in/mbadran0109' },
      { cls: 'x', label: 'X', href: 'https://x.com/mbadran0109' },
      { cls: 'gh', label: 'GitHub', href: 'https://github.com/mbadran0109' },
      { cls: 'yt', label: 'YouTube', href: 'https://youtube.com/@mbadran0109' }
    ]
  };

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function joinPath(root, path) {
    if (!root || root === '.') return path;
    return root.replace(/\/+$/, '') + '/' + path.replace(/^\/+/, '');
  }

  // ==========================================================================
  // 1. Shared Component Renderers (Nav, Service Switcher, Contact, Footer)
  // ==========================================================================
  function renderNavigation(root, pageType) {
    const mount = document.querySelector('[data-component="nav"]');
    if (!mount) return;

    const isHome = pageType === 'home';
    const homeHref = isHome ? '#home' : joinPath(root, 'index.html');
    const sectionPrefix = isHome ? '' : joinPath(root, 'index.html');
    const logoSrc = joinPath(root, 'images/MBLogo.png');

    const navLinks = [
      { label: 'Home', href: homeHref, id: 'home', active: isHome },
      { label: 'Profiles', href: `${sectionPrefix}#resumes`, id: 'resumes', active: false },
      { label: 'Education', href: `${sectionPrefix}#education`, id: 'education', active: false },
      { label: 'Domains', href: `${sectionPrefix}#services`, id: 'services', active: !isHome },
      { label: 'Contact', href: '#contact', id: 'contact', active: false }
    ];

    const linksHtml = navLinks
      .map(
        (item) =>
          `<li><a href="${item.href}" data-nav-target="${item.id}"${item.active ? ' class="active"' : ''}>${item.label}</a></li>`
      )
      .join('');

    mount.innerHTML = `
      <nav class="site-nav" aria-label="Primary navigation">
        <div class="logo">
          <a href="${homeHref}" aria-label="${escapeHtml(SITE_CONFIG.name)} Home">
            <img src="${logoSrc}" alt="${escapeHtml(SITE_CONFIG.name)} logo" class="logo-img" width="40" height="40">
          </a>
          <a href="${homeHref}" class="logo-name">${escapeHtml(SITE_CONFIG.name)}</a>
        </div>
        <button type="button" class="menu-toggle" aria-label="Toggle navigation" aria-expanded="false" aria-controls="primary-nav">&#9776;</button>
        <ul id="primary-nav">${linksHtml}</ul>
      </nav>
    `;
  }

  function renderServiceSwitcher(root) {
    const mount = document.querySelector('[data-component="service-switcher"]');
    if (!mount) return;

    const currentSlug = mount.dataset.current || '';
    const pillsHtml = SITE_CONFIG.services
      .map((svc) => {
        const isCurrent = svc.slug === currentSlug;
        const href = joinPath(root, `services/${svc.slug}/index.html`);
        return `<a href="${href}" class="service-pill${isCurrent ? ' active' : ''}"${isCurrent ? ' aria-current="page"' : ''}>${escapeHtml(svc.name)}</a>`;
      })
      .join('');

    mount.classList.add('service-switcher');
    mount.innerHTML = `
      <p class="service-switcher-title">Explore Other Domains</p>
      <div class="service-switcher-list">${pillsHtml}</div>
      <p style="margin-top: 1.5rem;">
        <a href="${joinPath(root, 'index.html#services')}" class="btn btn-outline btn-sm">&larr; Back to All Domains</a>
      </p>
    `;
  }

  function renderContactForm() {
    const mount = document.querySelector('[data-component="contact"]');
    if (!mount) return;

    const defaultService = (mount.dataset.service || '').trim();
    const optionsHtml = SITE_CONFIG.services
      .map((svc) => {
        const isSelected = defaultService && (svc.slug === defaultService || svc.name === defaultService);
        return `<option value="${escapeHtml(svc.name)}"${isSelected ? ' selected' : ''}>${escapeHtml(svc.name)}</option>`;
      })
      .join('');

    mount.innerHTML = `
      <h2 class="section-title">Contact Me</h2>
      <p class="contact-copy">
        Fill out the form below and I will get back to you regarding your inquiry or project, or email me directly at
        <a class="direct-email-link" href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>.
      </p>
      <form id="contact-form" class="contact-form" novalidate>
        <div class="form-hp" aria-hidden="true">
          <label for="website">Website</label>
          <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" autocomplete="given-name" required>
          </div>
          <div class="form-field">
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" autocomplete="family-name" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-field">
            <label for="phone">Phone Number</label>
            <input type="tel" id="phone" name="phone" autocomplete="tel">
          </div>
          <div class="form-field">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" autocomplete="email" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-field full">
            <label for="service">Service Interested In</label>
            <select id="service" name="service">
              <option value="">Select a service</option>
              ${optionsHtml}
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-field full">
            <label for="message">Describe the job / inquiry</label>
            <textarea id="message" name="message" rows="6" placeholder="Describe the project, timeline, budget or any other details..." required></textarea>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn submit-btn">Send Inquiry</button>
          <div id="contact-success" class="form-status" role="status" aria-live="polite"></div>
        </div>
      </form>
    `;
  }

  function renderFooter() {
    const mount = document.querySelector('[data-component="footer"]');
    if (!mount) return;

    const socialsHtml = SITE_CONFIG.socials
      .map(
        (s) =>
          `<a class="social-btn ${s.cls}" href="${s.href}" target="_blank" rel="noopener noreferrer">${s.label}</a>`
      )
      .join('');

    mount.classList.add('site-footer');
    mount.innerHTML = `
      <h2 class="footer-title">Stay Connected</h2>
      <p class="footer-copy">Follow me on social platforms or reach out at <a class="direct-email-link" href="mailto:${SITE_CONFIG.email}">${SITE_CONFIG.email}</a>:</p>
      <div class="socials">${socialsHtml}</div>
      <p class="footer-copy">Based in ${escapeHtml(SITE_CONFIG.location)}.</p>
      <p class="footer-copy">&copy; ${SITE_CONFIG.copyrightYear} ${escapeHtml(SITE_CONFIG.name)}. All rights reserved.</p>
    `;
  }

  // ==========================================================================
  // 2. Mobile Navigation & Scrollspy
  // ==========================================================================
  function initNavigation(pageType) {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav.site-nav ul');

    if (menuToggle && navUl) {
      const setMenuState = (open) => {
        navUl.classList.toggle('active', open);
        menuToggle.setAttribute('aria-expanded', String(open));
      };

      const closeMenu = () => setMenuState(false);

      menuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        setMenuState(!navUl.classList.contains('active'));
      });

      navUl.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', closeMenu);
      });

      document.addEventListener('click', (event) => {
        if (!navUl.contains(event.target) && !menuToggle.contains(event.target)) {
          closeMenu();
        }
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && navUl.classList.contains('active')) {
          closeMenu();
          menuToggle.focus();
        }
      });
    }

    // Active-section scrollspy on homepage
    if (pageType === 'home' && 'IntersectionObserver' in window) {
      const sections = document.querySelectorAll('main section[id]');
      const navLinks = document.querySelectorAll('nav.site-nav ul a[data-nav-target]');
      if (sections.length && navLinks.length) {
        const setActive = (id) => {
          navLinks.forEach((link) => {
            link.classList.toggle('active', link.dataset.navTarget === id);
          });
        };

        const spy = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                setActive(entry.target.id);
              }
            });
          },
          { rootMargin: '-30% 0px -55% 0px', threshold: 0.05 }
        );

        sections.forEach((sec) => spy.observe(sec));
      }
    }
  }

  // ==========================================================================
  // 2b. Interactive Career Track Switcher & Shareable URL Filter (?track=...)
  // ==========================================================================
  const TRACK_PRESETS = {
    all: {
      label: 'All Tracks',
      title: 'Software, AI & Robotics Engineer',
      desc: 'I build intelligent software, AI-powered applications, and connected robotic systems—backed by hands-on experience in IT infrastructure, engineering operations, and technical training. One systems-engineering mindset applied across software, hardware, and people.',
      defaultService: ''
    },
    software: {
      label: 'Software, Web/App & AI',
      title: 'Software, Web/App & AI Engineer',
      desc: 'Building AI-assisted full-stack web, mobile, and enterprise systems—combining ASP.NET Core, C#, Angular, Flutter, Python ML/GenAI (RAG, Semantic Kernel, AI Agents), SQL, and software QA testing.',
      defaultService: 'Software, AI & Data Science'
    },
    robotics: {
      label: 'Robotics, AI & Education',
      title: 'AI, Robotics & Technical Education Specialist',
      desc: 'Engineering connected embedded and IoT robotic systems, designing hands-on STEAM & technical training programs for 2,000+ learners, and serving as Head of Judges for national robotics championships.',
      defaultService: 'Robotics & Embedded Systems'
    },
    operations: {
      label: 'IT, 3D & Operations',
      title: 'IT Infrastructure & Systems Operations Engineer',
      desc: 'Combining a B.Sc. in Production Engineering with enterprise IT networking, API workflow automation, 3D CAD prototyping, and technical operations leadership for 100+ device live events.',
      defaultService: 'IT Infrastructure & Maintenance'
    }
  };

  function initTrackSwitcher() {
    const tabs = document.querySelectorAll('.track-tab[data-track]');
    if (!tabs.length) return;

    const heroTitle = document.getElementById('hero-role-title');
    const heroDesc = document.getElementById('hero-role-desc');
    const profileCards = document.querySelectorAll('.profile-card[data-track-card]');
    const domainCards = document.querySelectorAll('.service-card[data-tracks]');
    const filterBar = document.getElementById('domain-filter-bar');
    const filterLabel = document.getElementById('domain-filter-label');
    const resetBtn = document.getElementById('domain-filter-reset');
    const serviceSelect = document.getElementById('service');

    const applyTrack = (trackKey, updateUrl) => {
      const key = TRACK_PRESETS[trackKey] ? trackKey : 'all';
      const preset = TRACK_PRESETS[key];

      if (heroTitle) heroTitle.textContent = preset.title;
      if (heroDesc) heroDesc.textContent = preset.desc;

      tabs.forEach((tab) => {
        const isActive = tab.dataset.track === key;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', String(isActive));
      });

      profileCards.forEach((card) => {
        const matches = card.dataset.trackCard === key;
        card.classList.toggle('is-highlighted', key !== 'all' && matches);
        card.classList.toggle('is-dimmed', key !== 'all' && !matches);
      });

      domainCards.forEach((card) => {
        if (key === 'all') {
          card.classList.remove('is-hidden');
          return;
        }
        const tracks = (card.dataset.tracks || '').split(/\s+/);
        card.classList.toggle('is-hidden', !tracks.includes(key));
      });

      if (filterBar && filterLabel) {
        filterBar.hidden = key === 'all';
        filterLabel.textContent = preset.label;
      }

      if (serviceSelect && preset.defaultService) {
        const matchOption = Array.from(serviceSelect.options).find(
          (opt) => opt.value === preset.defaultService || opt.textContent.trim() === preset.defaultService
        );
        if (matchOption) serviceSelect.value = matchOption.value;
      }

      if (updateUrl && window.history && typeof window.history.replaceState === 'function') {
        const url = new URL(window.location.href);
        if (key === 'all') {
          url.searchParams.delete('track');
        } else {
          url.searchParams.set('track', key);
        }
        window.history.replaceState({}, '', url.toString());
      }
    };

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => applyTrack(tab.dataset.track, true));
    });

    document.querySelectorAll('[data-select-track]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetTrack = btn.dataset.selectTrack;
        applyTrack(targetTrack, true);
        const domainsSection = document.getElementById('services');
        if (domainsSection) {
          domainsSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    if (resetBtn) {
      resetBtn.addEventListener('click', () => applyTrack('all', true));
    }

    const params = new URLSearchParams(window.location.search);
    const initialTrack = (params.get('track') || 'all').toLowerCase();
    applyTrack(initialTrack, false);
  }

  // ==========================================================================
  // 3. Scroll Animation Observers (Fade-up & Cards)
  // ==========================================================================
  function initScrollAnimations() {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const fadeEls = document.querySelectorAll('.animate-fade-up');
    const cards = document.querySelectorAll('.card');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      fadeEls.forEach((el) => el.classList.add('show'));
      cards.forEach((c) => c.classList.add('revealed'));
      return;
    }

    if (fadeEls.length) {
      const fadeObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const rawDelay = parseFloat(entry.target.getAttribute('data-animate-delay') || '0');
            const clampedDelay = Number.isFinite(rawDelay) ? Math.min(Math.max(rawDelay, 0), 0.25) : 0;
            entry.target.style.transitionDelay = `${clampedDelay}s`;
            entry.target.classList.add('show');
            const clearDelay = () => {
              entry.target.style.transitionDelay = '';
              entry.target.removeEventListener('transitionend', clearDelay);
            };
            entry.target.addEventListener('transitionend', clearDelay);
            fadeObs.unobserve(entry.target);
          });
        },
        { threshold: 0.08 }
      );
      fadeEls.forEach((el) => fadeObs.observe(el));
    }

    if (cards.length) {
      const cardObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('revealed');
            cardObs.unobserve(entry.target);
          });
        },
        { threshold: 0.08 }
      );
      cards.forEach((c) => cardObs.observe(c));
    }
  }

  // ==========================================================================
  // 4. Interactive Collapsible Cards (Services & Timelines)
  // ==========================================================================
  function initCollapsibleCards() {
    const toggleButtons = document.querySelectorAll('.toggle-btn');

    toggleButtons.forEach((btn) => {
      const openLabel = btn.dataset.openLabel || 'Hide Details';
      const closedLabel = btn.dataset.closedLabel || btn.textContent.trim() || 'Details';

      btn.addEventListener('click', () => {
        const card = btn.closest('.service-card, .timeline-card');
        if (!card) return;
        const body = card.querySelector('.service-body, .timeline-body');
        if (!body) return;

        const isOpen = card.classList.contains('open');

        if (isOpen) {
          body.style.maxHeight = body.scrollHeight + 'px';
          body.offsetHeight; // Force reflow before collapsing
          body.style.maxHeight = '0px';
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = closedLabel;
          card.classList.remove('open');
          return;
        }

        card.classList.add('open');
        body.style.maxHeight = body.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
        btn.textContent = openLabel;

        const finishOpen = (event) => {
          if (event.target !== body || event.propertyName !== 'max-height') return;
          if (card.classList.contains('open')) {
            body.style.maxHeight = 'none';
          }
          body.removeEventListener('transitionend', finishOpen);
        };
        body.addEventListener('transitionend', finishOpen);
      });
    });

    // Backwards compatibility for any button.more-btn[data-href]
    document.addEventListener('click', (e) => {
      const more = e.target.closest('button.more-btn[data-href]');
      if (!more) return;
      const href = more.dataset.href;
      if (href) window.location.href = href;
    });
  }

  // ==========================================================================
  // 5. Media Gallery Lightbox
  // ==========================================================================
  function initLightbox() {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item, [data-lightbox]'));
    if (!galleryItems.length) return;

    const modal = document.createElement('div');
    modal.className = 'lightbox';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Image preview');
    modal.innerHTML = `
      <button type="button" class="lightbox-close" aria-label="Close preview">&times;</button>
      <button type="button" class="lightbox-nav lightbox-prev" aria-label="Previous image">&#8249;</button>
      <div class="lightbox-dialog">
        <img class="lightbox-img" src="" alt="">
        <p class="lightbox-caption"></p>
      </div>
      <button type="button" class="lightbox-nav lightbox-next" aria-label="Next image">&#8250;</button>
    `;
    document.body.appendChild(modal);

    const imgEl = modal.querySelector('.lightbox-img');
    const captionEl = modal.querySelector('.lightbox-caption');
    const closeBtn = modal.querySelector('.lightbox-close');
    const prevBtn = modal.querySelector('.lightbox-prev');
    const nextBtn = modal.querySelector('.lightbox-next');

    let currentIndex = 0;
    let lastTrigger = null;

    const getItemData = (item) => {
      const img = item.tagName === 'IMG' ? item : item.querySelector('img');
      const figcaption = item.querySelector && item.querySelector('figcaption');
      return {
        src: item.dataset.lightboxSrc || (img ? img.currentSrc || img.src : ''),
        alt: img ? img.alt : '',
        caption: item.dataset.caption || (figcaption ? figcaption.textContent.trim() : img ? img.alt : '')
      };
    };

    const showItem = (index) => {
      currentIndex = (index + galleryItems.length) % galleryItems.length;
      const data = getItemData(galleryItems[currentIndex]);
      imgEl.src = data.src;
      imgEl.alt = data.alt;
      captionEl.textContent = data.caption;
      captionEl.style.display = data.caption ? 'block' : 'none';
      const showNav = galleryItems.length > 1;
      prevBtn.style.display = showNav ? 'inline-flex' : 'none';
      nextBtn.style.display = showNav ? 'inline-flex' : 'none';
    };

    const openLightbox = (index, trigger) => {
      lastTrigger = trigger;
      showItem(index);
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      closeBtn.focus();
    };

    const closeLightbox = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    };

    galleryItems.forEach((item, index) => {
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'button');
      item.addEventListener('click', () => openLightbox(index, item));
      item.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openLightbox(index, item);
        }
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
    nextBtn.addEventListener('click', () => showItem(currentIndex + 1));

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft' && galleryItems.length > 1) showItem(currentIndex - 1);
      if (e.key === 'ArrowRight' && galleryItems.length > 1) showItem(currentIndex + 1);
    });
  }

  // ==========================================================================
  // 6. EmailJS v4 Contact Form Integration
  // ==========================================================================
  function initContactForm() {
    const contactForm = document.querySelector('#contact-form');
    if (!contactForm) return;

    const EMAILJS_SERVICE_ID = 'mbadran.inquiry';
    const EMAILJS_TEMPLATE_ID = 'mbadran.inquiry.template';
    const EMAILJS_PUBLIC_KEY = 'Q0UeVHKGUKCIpDaRz';
    const EMAILJS_CDN = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';

    let emailJsInitialized = false;
    let statusTimer = null;

    function loadScript(url) {
      return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = url;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = () => {
          s.remove();
          reject(new Error('Failed to load ' + url));
        };
        document.head.appendChild(s);
      });
    }

    async function ensureEmailJS() {
      if (!window.emailjs) await loadScript(EMAILJS_CDN);
      if (!window.emailjs) throw new Error('EmailJS loaded but global not found');
      if (!emailJsInitialized) {
        window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
        emailJsInitialized = true;
      }
    }

    const statusEl = document.getElementById('contact-success');
    const submitButton = contactForm.querySelector('button[type="submit"]');

    const setStatus = (html, stateClass, autoHideMs) => {
      if (!statusEl) return;
      if (statusTimer) {
        clearTimeout(statusTimer);
        statusTimer = null;
      }
      statusEl.className = 'form-status is-visible' + (stateClass ? ` ${stateClass}` : '');
      statusEl.innerHTML = html;
      if (autoHideMs) {
        statusTimer = setTimeout(() => {
          statusEl.className = 'form-status';
          statusEl.textContent = '';
        }, autoHideMs);
      }
    };

    const setSubmitting = (isSubmitting) => {
      if (!submitButton) return;
      submitButton.disabled = isSubmitting;
      submitButton.textContent = isSubmitting ? 'Sending...' : 'Send Inquiry';
    };

    contactForm.addEventListener('submit', async (ev) => {
      ev.preventDefault();

      // Use native constraint validation messages when fields are invalid
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      // Honeypot check to silently drop automated spam bots
      const honeypot = contactForm.querySelector('#website');
      if (honeypot && honeypot.value.trim() !== '') {
        setStatus('Message sent &mdash; thank you!', 'is-success', 5000);
        contactForm.reset();
        return;
      }

      const first = document.querySelector('#firstName')?.value.trim() || '';
      const last = document.querySelector('#lastName')?.value.trim() || '';
      const phone = document.querySelector('#phone')?.value.trim() || '';
      const email = document.querySelector('#email')?.value.trim() || '';
      const message = document.querySelector('#message')?.value.trim() || '';
      const serviceSelect = document.querySelector('#service');
      const selectedService =
        serviceSelect && serviceSelect.selectedIndex > 0
          ? serviceSelect.options[serviceSelect.selectedIndex].textContent.trim()
          : '';

      const templateParams = {
        to_email: SITE_CONFIG.email,
        client_email: email,
        cc_email: email,
        first_name: first,
        last_name: last,
        phone: phone,
        service: selectedService,
        message: message,
        title: `Website inquiry: ${selectedService || 'General'} - ${first} ${last}`,
        time: new Date().toLocaleString()
      };

      setStatus('Sending inquiry...', '', 0);
      setSubmitting(true);

      try {
        await ensureEmailJS();
        await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
        setStatus('Message sent &mdash; thank you!', 'is-success', 6000);
        contactForm.reset();
      } catch (err) {
        console.error('EmailJS error', err);
        const subject = encodeURIComponent(templateParams.title);
        const body = encodeURIComponent(
          `Name: ${first} ${last}\nPhone: ${phone || 'N/A'}\nService: ${selectedService || 'General'}\n\n${message}`
        );
        setStatus(
          `Could not send right now. You can <a href="mailto:${SITE_CONFIG.email}?subject=${subject}&body=${body}">email me directly</a>.`,
          'is-error',
          0
        );
      } finally {
        setSubmitting(false);
      }
    });
  }

  // ==========================================================================
  // Bootstrap
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.body.dataset.root || '.';
    const pageType = document.body.dataset.page || '';

    renderNavigation(root, pageType);
    renderServiceSwitcher(root);
    renderContactForm();
    renderFooter();

    initNavigation(pageType);
    initTrackSwitcher();
    initScrollAnimations();
    initCollapsibleCards();
    initLightbox();
    initContactForm();
  });
})();

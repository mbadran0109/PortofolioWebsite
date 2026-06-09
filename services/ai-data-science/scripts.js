/*
    services/ai-data-science/scripts.js
    Purpose: Page-specific JS for AI & Data Science.
    Contains: reveal animations, collapsible service cards,
              delegated "More" navigation, and contact form EmailJS submit.
*/

document.addEventListener('DOMContentLoaded', function () {

    // --- Fade-up animation setup -----------------------------------------------
    const els = Array.from(document.querySelectorAll('.animate-fade-up'));
    els.forEach(el => {
        const delay = el.getAttribute('data-animate-delay') || '0s';
        el.style.transitionDelay = delay;
        setTimeout(() => el.classList.add('show'), 50);
    });

    // --- Reveal cards on scroll -------------------------------------------------
    const cards = document.querySelectorAll('.card');
    if (cards.length) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        cards.forEach(c => obs.observe(c));
    }

    // --- Collapsible service card behavior --------------------------------------
    const toggleButtons = document.querySelectorAll('.toggle-btn');
    toggleButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const card   = btn.closest('.service-card');
            const body   = card.querySelector('.service-body');
            const isOpen = card.classList.contains('open');
            if (isOpen) {
                body.style.maxHeight = body.scrollHeight + 'px';
                requestAnimationFrame(() => { body.style.maxHeight = '0px'; });
                btn.setAttribute('aria-expanded', 'false');
                card.classList.remove('open');
            } else {
                card.classList.add('open');
                body.style.maxHeight = body.scrollHeight + 'px';
                btn.setAttribute('aria-expanded', 'true');
                const finishOpen = () => {
                    if (card.classList.contains('open')) body.style.maxHeight = 'none';
                    body.removeEventListener('transitionend', finishOpen);
                };
                body.addEventListener('transitionend', finishOpen);
                card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    });

    // --- Delegated "More" button navigation ------------------------------------
    document.addEventListener('click', (e) => {
        const more = e.target.closest('.more-btn');
        if (!more) return;
        const card = more.closest('.service-card');
        if (!card || !card.classList.contains('open')) return;
        const href = more.dataset.href;
        if (!href) return;
        window.location.href = href;
    });

    // --- EmailJS configuration -------------------------------------------------
    const EMAILJS_SERVICE_ID  = 'mbadran.inquiry';
    const EMAILJS_TEMPLATE_ID = 'mbadran.inquiry.template';
    const EMAILJS_USER_ID     = 'Q0UeVHKGUKCIpDaRz';
    const EMAILJS_CDN         = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';

    function loadScript(url) {
        return new Promise((resolve, reject) => {
            const s = document.createElement('script');
            s.src = url; s.async = true;
            s.onload  = () => resolve();
            s.onerror = () => reject(new Error('Failed to load ' + url));
            document.head.appendChild(s);
        });
    }

    async function ensureEmailJS() {
        if (window.emailjs) return;
        await loadScript(EMAILJS_CDN);
        if (!window.emailjs) throw new Error('EmailJS loaded but global not found');
    }

    if (window.emailjs) { emailjs.init(EMAILJS_USER_ID); }

    // --- Contact form submission ------------------------------------------------
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (ev) => {
            ev.preventDefault();

            const first   = document.querySelector('#firstName').value.trim();
            const last    = document.querySelector('#lastName').value.trim();
            const phone   = document.querySelector('#phone').value.trim();
            const email   = document.querySelector('#email').value.trim();
            const message = document.querySelector('#message').value.trim();

            const serviceSelect   = document.querySelector('#service');
            const selectedService = (serviceSelect && serviceSelect.selectedIndex > 0)
                ? serviceSelect.options[serviceSelect.selectedIndex].textContent.trim()
                : '';

            const templateParams = {
                to_email:     'mbadran0109@gmail.com',
                client_email: email || '',
                cc_email:     email || '',
                first_name:   first,
                last_name:    last,
                phone:        phone,
                service:      selectedService,
                message:      message,
                title:        `Service inquiry: ${selectedService || 'General'} - ${first} ${last}`,
                time:         new Date().toLocaleString()
            };

            const success = document.getElementById('contact-success');

            try {
                await ensureEmailJS();
                if (window.emailjs) emailjs.init(EMAILJS_USER_ID);
            } catch (err) {
                alert('Could not load EmailJS SDK. Check your internet connection.');
                return;
            }

            try {
                await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
                if (success) { success.style.display = 'inline-block'; success.textContent = 'Message sent - thank you!'; }
                contactForm.reset();
                setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
            } catch (err) {
                console.error('EmailJS error', err);
                if (success) { success.style.display = 'inline-block'; success.textContent = 'Error sending message'; }
                setTimeout(() => { if (success) success.style.display = 'none'; }, 5000);
            }
        });
    }
});

/*
	services/industrial-engineering/scripts.js
	Purpose: Page-specific JS for Industrial Engineering page.
	Contains:
		- reveal animations
		- collapsible service-card handlers
		- EmailJS contact form submission wiring
*/
document.addEventListener('DOMContentLoaded', function () {
	const els = Array.from(document.querySelectorAll('.animate-fade-up'));
	els.forEach(el => {
		const delay = el.getAttribute('data-animate-delay') || '0s';
		el.style.transitionDelay = delay;
		setTimeout(() => el.classList.add('show'), 50);
	});

	const cards = document.querySelectorAll('.card');
	const obs = new IntersectionObserver((entries) => {
		entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); obs.unobserve(entry.target); } });
	}, { threshold: 0.12 });
	cards.forEach(c => obs.observe(c));

	const toggleButtons = document.querySelectorAll('.toggle-btn');
	toggleButtons.forEach(btn => {
		btn.addEventListener('click', () => {
			const card = btn.closest('.service-card');
			const body = card.querySelector('.service-body');
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
				const finishOpen = () => { if (card.classList.contains('open')) body.style.maxHeight = 'none'; body.removeEventListener('transitionend', finishOpen); };
				body.addEventListener('transitionend', finishOpen);
				card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		});
	});

	document.addEventListener('click', (e) => {
		const more = e.target.closest('.more-btn');
		if (!more) return;
		const card = more.closest('.service-card');
		if (!card || !card.classList.contains('open')) return;
		const href = more.dataset.href;
		if (!href) return;
		window.location.href = href;
	});

	const EMAILJS_SERVICE_ID = 'mbadran.inquiry';
	const EMAILJS_TEMPLATE_ID = 'mbadran.inquiry.template';
	const EMAILJS_USER_ID = 'Q0UeVHKGUKCIpDaRz';
	const EMAILJS_CDN = 'https://cdn.jsdelivr.net/npm/emailjs-com@3/dist/email.min.js';
	function loadScript(url) { return new Promise((resolve, reject) => { const s = document.createElement('script'); s.src = url; s.async = true; s.onload = () => resolve(); s.onerror = () => reject(new Error('Failed to load ' + url)); document.head.appendChild(s); }); }
	async function ensureEmailJS() { if (window.emailjs) return; try { await loadScript(EMAILJS_CDN); if (window.emailjs) return; throw new Error('EmailJS loaded but global not found'); } catch (err) { console.warn('Failed to load EmailJS SDK dynamically:', err); throw err; } }
	if (window.emailjs) { emailjs.init(EMAILJS_USER_ID); }

	const contactForm = document.querySelector('#contact-form');
	if (contactForm) {
		contactForm.addEventListener('submit', async (ev) => {
			ev.preventDefault();
			const first = document.querySelector('#firstName').value.trim();
			const last = document.querySelector('#lastName').value.trim();
			const phone = document.querySelector('#phone').value.trim();
			const email = document.querySelector('#email').value.trim();
			const service = document.querySelector('#service').value.trim();
			const message = document.querySelector('#message').value.trim();
			let selectedService = service;
			const serviceSelect = document.querySelector('#service');
			if ((!selectedService || selectedService === '') && serviceSelect && serviceSelect.selectedIndex > 0) {
				selectedService = serviceSelect.options[serviceSelect.selectedIndex].textContent.trim();
			}
			const templateParams = { to_email: 'mbadran0109@gmail.com', client_email: email || '', cc_email: email || '', first_name: first, last_name: last, phone: phone, service: selectedService, message: message, title: `Website inquiry: ${service || 'General'} - ${first} ${last}`, time: new Date().toLocaleString() };
			console.log('EmailJS templateParams:', templateParams);
			const success = document.getElementById('contact-success');
			try { await ensureEmailJS(); if (window.emailjs) emailjs.init(EMAILJS_USER_ID); } catch (err) { alert('Could not load EmailJS SDK. Check your internet connection or include the SDK locally.'); return; }
			emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams).then(() => { if (success) { success.style.display = 'inline-block'; success.textContent = 'Message sent - thank you!'; } contactForm.reset(); setTimeout(() => { if (success) success.style.display = 'none'; }, 5000); }, (err) => { console.error('EmailJS error', err); if (success) { success.style.display = 'inline-block'; success.textContent = 'Error sending message'; } setTimeout(() => { if (success) success.style.display = 'none'; }, 5000); });
		});
	}
});

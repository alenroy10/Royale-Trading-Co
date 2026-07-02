const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');
const prevBtn = document.querySelector('.hero-prev');
const nextBtn = document.querySelector('.hero-next');
const yearEl = document.getElementById('year');
const contactForm = document.querySelector('.contact-form');

let currentSlide = 0;
let slideTimer;

function setSlide(index) {
  const total = slides.length;
  currentSlide = ((index % total) + total) % total;

  slides.forEach((slide, i) => {
    slide.classList.toggle('is-active', i === currentSlide);
  });

  dots.forEach((dot, i) => {
    const active = i === currentSlide;
    dot.classList.toggle('is-active', active);
    dot.setAttribute('aria-selected', active);
  });
}

function nextSlide() {
  setSlide(currentSlide + 1);
}

function prevSlide() {
  setSlide(currentSlide - 1);
}

function startAutoplay() {
  clearInterval(slideTimer);
  slideTimer = setInterval(nextSlide, 6000);
}

function stopAutoplay() {
  clearInterval(slideTimer);
}

// Header scroll state
function onScroll() {
  header.classList.toggle('is-scrolled', window.scrollY > 60);
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav
navToggle?.addEventListener('click', () => {
  const open = siteNav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

siteNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Keep the current page section visible in the navigation
const navSectionLinks = [...(siteNav?.querySelectorAll('a[href^="#"]') || [])].filter(
  (link) => link.getAttribute('href') !== '#contact'
);
const navSections = navSectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const navObserver = new IntersectionObserver(
  (entries) => {
    const visible = entries.find((entry) => entry.isIntersecting);
    if (!visible) return;

    navSectionLinks.forEach((link) => {
      link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
    });
  },
  { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
);

navSections.forEach((section) => navObserver.observe(section));

// Hero controls
prevBtn?.addEventListener('click', () => {
  prevSlide();
  startAutoplay();
});

nextBtn?.addEventListener('click', () => {
  nextSlide();
  startAutoplay();
});

dots.forEach((dot) => {
  dot.addEventListener('click', () => {
    setSlide(Number(dot.dataset.index));
    startAutoplay();
  });
});

const hero = document.querySelector('.hero');
hero?.addEventListener('mouseenter', stopAutoplay);
hero?.addEventListener('mouseleave', startAutoplay);

startAutoplay();

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach((el) => revealObserver.observe(el));

// Footer year
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Contact form — FormSubmit (https://formsubmit.co) delivers to business email
const FORM_ENDPOINT = 'https://formsubmit.co/ajax/export@royaletradingco.com';
const inquiryLabels = {
  wholesale: 'Wholesale / export',
  samples: 'Sample request',
  retail: 'Retail partnership',
  other: 'Other',
};

function setFormStatus(message, type) {
  const status = document.getElementById('form-status');
  if (!status) return;
  status.textContent = message;
  status.hidden = !message;
  status.classList.remove('is-success', 'is-error');
  if (type) status.classList.add(type);
}

contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const honey = contactForm.querySelector('[name="_honey"]');
  if (honey?.value) return;

  const btn = contactForm.querySelector('button[type="submit"]');
  const originalLabel = btn.textContent;
  const formData = new FormData(contactForm);
  const name = formData.get('name')?.toString().trim() || '';
  const email = formData.get('email')?.toString().trim() || '';
  const company = formData.get('company')?.toString().trim() || '—';
  const inquiry = formData.get('inquiry')?.toString() || 'other';
  const message = formData.get('message')?.toString().trim() || '';

  if (!name || !email || !message) {
    setFormStatus('Please fill in your name, email, and message.', 'is-error');
    return;
  }

  btn.disabled = true;
  btn.textContent = 'Sending…';
  setFormStatus('', null);

  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        company,
        inquiry: inquiryLabels[inquiry] || inquiry,
        message,
        _subject: `Royale Trading — ${inquiryLabels[inquiry] || inquiry} (${name})`,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || data.success === false) {
      throw new Error(data.message || 'Submission failed');
    }

    contactForm.reset();
    setFormStatus(
      'Thank you — your inquiry was sent. We will reply to your email shortly.',
      'is-success'
    );
    btn.textContent = 'Sent';
  } catch {
    setFormStatus(
      'Could not send right now. Please email export@royaletradingco.com or call +91 75109 95173.',
      'is-error'
    );
    btn.textContent = originalLabel;
  } finally {
    setTimeout(() => {
      btn.disabled = false;
      if (btn.textContent === 'Sent') btn.textContent = originalLabel;
    }, 4000);
  }
});

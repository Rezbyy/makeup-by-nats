/* ================================================
   MAKEUP BY NATS — Main JavaScript
   ================================================ */

/* --- LOADER --- */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.querySelector('.loader');
    if (loader) loader.classList.add('hidden');
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero-loaded');
  }, 1400);
});

/* --- NAVIGATION --- */
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (nav) nav.classList.toggle('scrolled', current > 60);
  lastScroll = current;
});

/* Mobile menu */
const hamburger = document.querySelector('.nav-hamburger');
const mobileNav = document.querySelector('.nav-mobile');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });
  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* Active nav link */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

/* --- SCROLL REVEAL (Intersection Observer) --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
  revealObserver.observe(el);
});

/* --- STATS COUNTER --- */
const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.done) {
      entry.target.dataset.done = '1';
      const target = parseInt(entry.target.dataset.target, 10);
      const suffix = entry.target.dataset.suffix || '';
      const duration = 2000;
      const startTime = performance.now();
      const startVal = 0;

      const tick = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startVal + (target - startVal) * ease);
        entry.target.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  });
}, { threshold: 0.6 });

document.querySelectorAll('[data-target]').forEach(el => countObserver.observe(el));

/* --- TESTIMONIALS SWIPER --- */
const testimonialsEl = document.querySelector('.testimonial-swiper');
if (testimonialsEl && typeof Swiper !== 'undefined') {
  new Swiper('.testimonial-swiper', {
    loop: true,
    speed: 900,
    autoplay: { delay: 5500, disableOnInteraction: false },
    effect: 'fade',
    fadeEffect: { crossFade: true },
    pagination: { el: '.swiper-pagination', clickable: true },
  });
}

/* --- GALLERY FILTER --- */
const filterBtns = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-grid-item');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;

    galleryItems.forEach((item, i) => {
      const match = filter === 'all' || item.dataset.category === filter;
      if (match) {
        item.style.display = 'block';
        setTimeout(() => item.classList.add('visible'), i * 40);
      } else {
        item.classList.remove('visible');
        setTimeout(() => { item.style.display = 'none'; }, 400);
      }
    });
  });
});

/* Initial reveal all gallery items */
galleryItems.forEach((item, i) => {
  setTimeout(() => item.classList.add('visible'), 300 + i * 60);
});

/* --- BEFORE/AFTER SLIDER --- */
const slider = document.querySelector('.before-after-slider');
if (slider) {
  const handle = slider.querySelector('.ba-handle');
  const afterEl = slider.querySelector('.ba-after');
  let dragging = false;

  const setPos = (clientX) => {
    const rect = slider.getBoundingClientRect();
    let pct = (clientX - rect.left) / rect.width * 100;
    pct = Math.min(Math.max(pct, 2), 98);
    handle.style.left = pct + '%';
    afterEl.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  };

  handle.addEventListener('mousedown', () => dragging = true);
  window.addEventListener('mouseup', () => dragging = false);
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  handle.addEventListener('touchstart', () => dragging = true, { passive: true });
  window.addEventListener('touchend', () => dragging = false);
  window.addEventListener('touchmove', e => {
    if (dragging) setPos(e.touches[0].clientX);
  }, { passive: true });

  setPos(slider.getBoundingClientRect().left + slider.getBoundingClientRect().width * 0.5);
}

/* --- FAQ ACCORDION --- */
document.querySelectorAll('.faq-item').forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!question || !answer) return;

  question.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-answer').style.maxHeight = '0';
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

/* --- ENQUIRY FORM --- */
const form = document.getElementById('enquiry-form');
if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const wrap = form.closest('.form-wrap') || form.parentElement;
    wrap.innerHTML = `
      <div class="form-success">
        <div class="t-stars">★ ★ ★ ★ ★</div>
        <h3>Thank You!</h3>
        <p>Your enquiry has been received. Nats will be in touch within 3 business days.</p>
      </div>`;
  });
}

/* --- GSAP (if available) --- */
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);

  /* Hero parallax */
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* CTA background parallax */
  const ctaBg = document.querySelector('.cta-bg');
  if (ctaBg) {
    gsap.to(ctaBg, {
      yPercent: 8,
      ease: 'none',
      scrollTrigger: { trigger: '.cta-section', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  }

  /* Staggered service cards */
  const serviceCards = document.querySelectorAll('.service-card');
  if (serviceCards.length) {
    gsap.fromTo(serviceCards,
      { y: 80, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.9, stagger: 0.15,
        scrollTrigger: { trigger: '.services-grid', start: 'top 80%' }
      }
    );
  }

  /* Gallery preview stagger */
  const gpItems = document.querySelectorAll('.gp-item');
  if (gpItems.length) {
    gsap.fromTo(gpItems,
      { scale: 0.94, opacity: 0 },
      {
        scale: 1, opacity: 1, duration: 0.7, stagger: 0.1,
        scrollTrigger: { trigger: '.gallery-preview-grid', start: 'top 80%' }
      }
    );
  }
}

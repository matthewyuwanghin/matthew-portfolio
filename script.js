/* ============================================================
   Matthew Yu Wang Hin — Portfolio interactions
   ============================================================ */

/* ---------- Language toggle (EN / 繁中) ---------- */
const langToggle = document.getElementById('langToggle');
const TITLES = {
  en: 'Matthew Yu Wang Hin — Product Manager Portfolio',
  zh: 'Matthew Yu Wang Hin — 產品經理作品集'
};

function setLang(lang) {
  document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
  document.querySelectorAll('[data-en]').forEach((el) => {
    const val = el.dataset[lang];
    if (val != null) el.innerHTML = val;
  });
  langToggle.textContent = lang === 'en' ? '中' : 'EN';
  langToggle.setAttribute(
    'aria-label',
    lang === 'en' ? '切換至繁體中文' : 'Switch to English'
  );
  document.title = TITLES[lang];
  try { localStorage.setItem('portfolio-lang', lang); } catch (e) {}
}

let currentLang = 'en';
try {
  const saved = localStorage.getItem('portfolio-lang');
  if (saved === 'en' || saved === 'zh') currentLang = saved;
} catch (e) {}
setLang(currentLang);

langToggle.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  setLang(currentLang);
});

/* ---------- Sticky nav style ---------- */
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

/* ---------- Active nav link on scroll ---------- */
const sectionIds = ['about', 'experience', 'projects', 'skills', 'education', 'contact'];
const linkFor = Object.fromEntries(
  [...navLinks.querySelectorAll('a')].map((a) => [a.getAttribute('href').slice(1), a])
);
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      Object.values(linkFor).forEach((a) => a.classList.remove('active'));
      const link = linkFor[entry.target.id];
      if (link) link.classList.add('active');
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) sectionObserver.observe(el);
});

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- Project filters ---------- */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    cards.forEach((card) => {
      const show = f === 'all' || card.dataset.cat === f;
      card.classList.toggle('hidden', !show);
      if (show) {
        card.classList.remove('visible');
        requestAnimationFrame(() => card.classList.add('visible'));
      }
    });
  });
});

/* ---------- Lightbox ---------- */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCaption = document.getElementById('lbCaption');
const lbClose = document.getElementById('lbClose');

function openLightbox(src, caption) {
  lbImg.src = src;
  lbImg.alt = caption || '';
  lbCaption.textContent = caption || '';
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

document.querySelectorAll('.card-media[data-full]').forEach((media) => {
  media.addEventListener('click', () =>
    openLightbox(media.dataset.full, media.dataset.caption || '')
  );
});
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox || e.target === lbClose) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

/* ---------- Hero parallax (subtle) ---------- */
const heroBg = document.querySelector('.hero-bg');
if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `translateY(${y * 0.18}px)`;
      }
    },
    { passive: true }
  );
}
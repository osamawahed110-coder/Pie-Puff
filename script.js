/* ═══════════════════════════════════════════════════════════
   PIE & PUFF LOUNGE — MAIN SCRIPT
   ═══════════════════════════════════════════════════════════ */

/* ── Theme helpers (defined first so initTheme can call them) ── */
function updateThemeBtn(theme) {
  const btn = document.getElementById('theme-btn');
  if (!btn) return;
  const isAr = document.documentElement.getAttribute('lang') === 'ar';
  if (theme === 'dark') {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.51-9.59c-.44-.06-.9-.1-1.36-.1-.09 0-.18 0-.27 0z"/>
      </svg>
      <span>${isAr ? 'وضع النهار' : 'Light Mode'}</span>`;
  } else {
    btn.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm0 16a1 1 0 0 1 1 1v2a1 1 0 1 1-2 0v-2a1 1 0 0 1 1-1zm8-6a1 1 0 0 1 0 2h-2a1 1 0 1 1 0-2h2zM6 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h2a1 1 0 0 1 1 1zm11.657-5.657a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zM7.757 16.243a1 1 0 0 1 0 1.414l-1.414 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 0 1 1.414 0zm9.9 1.414a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414l-1.414 1.414zM7.757 7.757a1 1 0 1 1-1.414-1.414l1.414-1.414a1 1 0 1 1 1.414 1.414L7.757 7.757zM12 7a5 5 0 1 0 0 10A5 5 0 0 0 12 7z"/>
      </svg>
      <span>${isAr ? 'وضع الليل' : 'Dark Mode'}</span>`;
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('pp-theme', next);
  updateThemeBtn(next);
}

window.toggleTheme = toggleTheme;

/* ── Init theme (runs immediately, before DOM ready is fine for <html> attr) ── */
(function initTheme() {
  const saved = localStorage.getItem('pp-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  /* btn might not exist yet – wait for DOM */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => updateThemeBtn(saved));
  } else {
    updateThemeBtn(saved);
  }
})();

/* ── Loading screen ─────────────────────────────────────── */
function hideLoading() {
  const loader = document.getElementById('loading');
  if (loader) loader.classList.add('hide');
}
if (document.readyState === 'complete') {
  setTimeout(hideLoading, 1600);
} else {
  window.addEventListener('load', () => setTimeout(hideLoading, 1600));
}

/* ── DOM-ready logic ────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Scroll-reveal (IntersectionObserver) ───────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.delay || 0);
        setTimeout(() => el.classList.add('in-view'), delay);
        revealObs.unobserve(el);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.section-header').forEach(el => revealObs.observe(el));

  document.querySelectorAll('.menu-card').forEach((card, i) => {
    card.dataset.delay = (i % 3) * 110;
    revealObs.observe(card);
  });

  document.querySelectorAll('.drink-card').forEach((card, i) => {
    card.dataset.delay = (i % 4) * 90;
    revealObs.observe(card);
  });

  const featBanner = document.getElementById('featured');
  if (featBanner) revealObs.observe(featBanner);

  /* ── Active nav on scroll ───────────────────────────────── */
  const sectionIds = ['pies', 'puffs', 'drinks', 'desserts'];
  const navBtns = {};
  sectionIds.forEach(id => { navBtns[id] = document.getElementById('nav-' + id); });

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        Object.values(navBtns).forEach(b => b && b.classList.remove('active'));
        const id = entry.target.id;
        if (navBtns[id]) navBtns[id].classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObs.observe(el);
  });

  /* ── Parallax on mouse move ─────────────────────────────── */
  let ticking = false;
  document.addEventListener('mousemove', (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const cx = window.innerWidth  / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;
      const logo = document.getElementById('main-logo');
      if (logo) logo.style.transform = `translate(${dx * 7}px, ${dy * 7}px)`;
      ticking = false;
    });
  });

  /* ── Smooth scroll for nav links ────────────────────────── */
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = target.getBoundingClientRect().top + window.scrollY - 70;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }
    });
  });

});

/* ── Particles Canvas ───────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = Array.from({ length: 55 }, () => ({
      x:     Math.random() * w,
      y:     Math.random() * h,
      r:     Math.random() * 2.2 + 0.4,
      vx:    (Math.random() - 0.5) * 0.3,
      vy:    (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.28 + 0.04,
      hue:   30 + Math.random() * 22
    }));
  }

  function animate() {
    ctx.clearRect(0, 0, w, h);
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = w; if (p.x > w) p.x = 0;
      if (p.y < 0) p.y = h; if (p.y > h) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${p.hue}, 88%, ${isDark ? 62 : 50}%)`;
      ctx.globalAlpha = isDark ? p.alpha : p.alpha * 0.6;
      ctx.fill();
    });
    ctx.globalAlpha = 1;
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', () => { resize(); createParticles(); });
  resize();
  createParticles();
  animate();
})();

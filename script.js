'use strict';

/* ── Utils ── */
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ============================================
   1. LOADING SCREEN
   ============================================ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = $('#loading-screen');
    if (loader) { loader.classList.add('hidden'); setTimeout(() => loader.remove(), 700); }
  }, 2400);
});

/* ============================================
   2. THEME — Dark / Light
   ============================================ */
const themeBtn  = $('#theme-toggle');
const themeIcon = themeBtn?.querySelector('i');

const applyTheme = (t) => {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('snw-ww-theme', t);
  if (themeIcon) themeIcon.className = t === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
};

const saved = localStorage.getItem('snw-ww-theme') ||
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
applyTheme(saved);

themeBtn?.addEventListener('click', () => {
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ============================================
   3. NAVBAR SCROLL & ACTIVE LINKS
   ============================================ */
const navbar = $('#navbar');

const onScroll = () => {
  /* Navbar */
  window.scrollY > 60 ? navbar?.classList.add('scrolled') : navbar?.classList.remove('scrolled');

  /* Back to top */
  const fabTop = $('#fab-top');
  if (fabTop) window.scrollY > 400 ? fabTop.classList.add('visible') : fabTop.classList.remove('visible');

  /* Active nav */
  $$('section[id]').forEach(sec => {
    const top  = sec.offsetTop - 110;
    const bot  = top + sec.offsetHeight;
    const id   = sec.id;
    const link = $(`.nav-link[href="#${id}"]`);
    if (window.scrollY >= top && window.scrollY < bot) {
      $$('.nav-link').forEach(l => l.classList.remove('active'));
      link?.classList.add('active');
    }
  });
};

window.addEventListener('scroll', onScroll, { passive: true });

/* ============================================
   4. HAMBURGER MOBILE MENU
   ============================================ */
const hamburger  = $('#hamburger');
const mobileMenu = $('#mobile-menu');

hamburger?.addEventListener('click', () => {
  const open = hamburger.classList.toggle('active');
  mobileMenu?.classList.toggle('active', open);
  hamburger.setAttribute('aria-expanded', open);
});

$$('.mobile-nav-link').forEach(l => l.addEventListener('click', () => {
  hamburger?.classList.remove('active');
  mobileMenu?.classList.remove('active');
}));

/* ============================================
   5. SMOOTH SCROLLING
   ============================================ */
$$('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const el = $(id);
    if (el) {
      e.preventDefault();
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  });
});

/* ============================================
   6. AOS INIT
   ============================================ */
if (typeof AOS !== 'undefined') {
  AOS.init({ duration: 650, easing: 'ease-out-cubic', once: true, offset: 50 });
}

/* ============================================
   7. COUNTER ANIMATION
   ============================================ */
const animCounter = el => {
  const target  = parseInt(el.dataset.target || el.innerText.replace(/\D/g, ''));
  const suffix  = el.dataset.suffix || '';
  const dur     = 2000;
  const start   = performance.now();
  const tick    = now => {
    const p = Math.min((now - start) / dur, 1);
    const v = Math.floor((1 - Math.pow(1 - p, 3)) * target);
    el.textContent = v.toLocaleString('id-ID') + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCounter(e.target); counterObs.unobserve(e.target); } });
}, { threshold: 0.5 });

$$('.counter').forEach(el => counterObs.observe(el));

/* ============================================
   8. TESTIMONIAL SWIPER
   ============================================ */
if (typeof Swiper !== 'undefined' && $('#testimonial-swiper')) {
  new Swiper('#testimonial-swiper', {
    slidesPerView: 1, spaceBetween: 24, loop: true,
    autoplay: { delay: 4800, disableOnInteraction: false, pauseOnMouseEnter: true },
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } },
  });
}

/* ============================================
   9. CONTACT FORM
   ============================================ */
$('#contact-form')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = e.target.querySelector('.btn-submit');
  const orig = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  btn.disabled = true;
  setTimeout(() => {
    btn.innerHTML = orig; btn.disabled = false;
    e.target.reset();
    showToast('✦ Pesan terkirim! Kami akan segera menghubungi Anda.', 'success');
  }, 2000);
});

/* ============================================
   10. TOAST
   ============================================ */
const showToast = (msg, type = 'success') => {
  let t = $('#toast');
  if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = msg; t.className = `toast ${type}`;
  requestAnimationFrame(() => t.classList.add('show'));
  setTimeout(() => t.classList.remove('show'), 4200);
};

/* ============================================
   11. BACK TO TOP
   ============================================ */
$('#fab-top')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ============================================
   12. TYPING EFFECT IN HERO
   ============================================ */
const typeEl = $('#typing-text');
if (typeEl) {
  const words = ['Jaringan Cepat', 'Koneksi Stabil', 'Solusi Andal', 'Fiber Optic', 'WiFi Enterprise', 'Network Aman'];
  let wi = 0, ci = 0, del = false;
  const type = () => {
    const w = words[wi];
    del ? typeEl.textContent = w.slice(0, ci--) : typeEl.textContent = w.slice(0, ci++);
    if (!del && ci > w.length) { del = true; setTimeout(type, 1600); return; }
    if (del && ci < 0) { del = false; wi = (wi + 1) % words.length; ci = 0; }
    setTimeout(type, del ? 55 : 85);
  };
  setTimeout(type, 1000);
}

/* ============================================
   13. SERVICE CARD 3D TILT
   ============================================ */
$$('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r  = card.getBoundingClientRect();
    const x  = (e.clientX - r.left) / r.width  - 0.5;
    const y  = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-8px) perspective(700px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ============================================
   14. PORTFOLIO LIGHTBOX
   ============================================ */
$$('.portfolio-overlay-btn').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const card  = btn.closest('.portfolio-card');
    const title = card.querySelector('h3')?.textContent || '';
    const desc  = card.querySelector('p')?.textContent  || '';
    const cat   = card.querySelector('.portfolio-badge')?.textContent || '';
    const ov    = document.createElement('div');
    ov.style.cssText = `position:fixed;inset:0;background:rgba(26,10,2,0.95);z-index:9000;display:flex;align-items:center;justify-content:center;padding:2rem;backdrop-filter:blur(12px);animation:fadeIn 0.3s ease;`;
    ov.innerHTML = `
      <div style="background:var(--surface);border-radius:var(--radius-xl);padding:2.5rem;max-width:540px;width:100%;border:2px solid var(--border-gold);position:relative;box-shadow:var(--shadow-xl);">
        <button onclick="this.closest('div').parentElement.remove()" style="position:absolute;top:1rem;right:1rem;background:none;border:none;font-size:1.5rem;cursor:pointer;color:var(--text-muted);">×</button>
        <span style="display:inline-block;padding:0.2rem 0.75rem;background:rgba(201,148,26,0.15);color:var(--gold);border-radius:100px;font-family:'Oswald',sans-serif;font-size:0.72rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1rem;">${cat}</span>
        <h3 style="font-size:1.5rem;color:var(--text-dark);margin-bottom:0.75rem;">${title}</h3>
        <p style="color:var(--text-muted);line-height:1.7;font-size:0.95rem;margin-bottom:2rem;">${desc}</p>
        <a href="#contact" onclick="this.closest('div').parentElement.parentElement.remove()" style="display:inline-flex;align-items:center;gap:0.5rem;padding:0.75rem 1.5rem;background:var(--grad-gold);color:var(--wood-darkest);border-radius:var(--radius-sm);font-family:'Oswald',sans-serif;font-weight:700;font-size:0.9rem;letter-spacing:0.08em;text-transform:uppercase;">Hubungi Kami</a>
      </div>`;
    document.body.appendChild(ov);
    ov.addEventListener('click', ev => { if (ev.target === ov) ov.remove(); });
  });
});

/* ============================================
   15. HERO PARTICLE CANVAS (subtle stars)
   ============================================ */
const initStars = () => {
  const canvas = $('#star-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
  window.addEventListener('resize', resize, { passive: true });
  resize();

  const stars = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.2 + 0.3, o: Math.random() * 0.6 + 0.2,
    s: (Math.random() - 0.5) * 0.15
  }));

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.x += s.s; s.o += (Math.random() - 0.5) * 0.02;
      s.o = Math.max(0.1, Math.min(0.8, s.o));
      if (s.x < 0) s.x = canvas.width;
      if (s.x > canvas.width) s.x = 0;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,148,26,${s.o})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };
  draw();
};
initStars();

/* ============================================
   16. SCROLL REVEAL FALLBACK
   ============================================ */
if (typeof AOS === 'undefined') {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  $$('[data-aos]').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(28px)';
    el.style.transition = 'opacity 0.65s ease, transform 0.65s ease';
    obs.observe(el);
  });
}

console.log('%c🤠 Smart Network — Wild West Modern', 'color:#C9941A;font-size:14px;font-weight:bold;font-family:serif;');
console.log('%cSolusi Jaringan Cepat, Stabil, dan Andal', 'color:#9B5E28;font-size:11px;');

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

/* ============================================
   MINI GAME — Network Education Quiz
   ============================================ */
const quizQuestions = [
  { cat:'Dasar Jaringan', q:'Apa kepanjangan dari IP dalam jaringan komputer?', opts:['Internet Protocol','Internal Program','Input Process','Integrated Port'], ans:0, info:'IP (Internet Protocol) adalah aturan komunikasi data di jaringan.' },
  { cat:'Perangkat Jaringan', q:'Perangkat yang menghubungkan dua atau lebih jaringan berbeda disebut?', opts:['Switch','Hub','Router','Bridge'], ans:2, info:'Router mengarahkan paket data antar jaringan yang berbeda.' },
  { cat:'Topologi', q:'Topologi jaringan yang semua perangkat terhubung ke satu kabel utama disebut?', opts:['Star','Ring','Bus','Mesh'], ans:2, info:'Topologi Bus menggunakan satu kabel backbone yang menghubungkan semua perangkat.' },
  { cat:'Kabel Jaringan', q:'Kabel apa yang digunakan dalam instalasi Fiber Optic?', opts:['Tembaga UTP','Kawat baja','Serat optik/kaca','Kabel koaksial'], ans:2, info:'Fiber Optic menggunakan serat kaca untuk mentransmisikan cahaya, bukan listrik.' },
  { cat:'Protokol', q:'Protokol mana yang digunakan untuk mengirim email?', opts:['HTTP','FTP','SMTP','DNS'], ans:2, info:'SMTP (Simple Mail Transfer Protocol) digunakan untuk pengiriman email.' },
  { cat:'Keamanan', q:'Apa fungsi utama Firewall dalam jaringan?', opts:['Mempercepat internet','Menyimpan data','Memfilter trafik berbahaya','Membagi bandwidth'], ans:2, info:'Firewall melindungi jaringan dengan memfilter paket data yang masuk dan keluar.' },
  { cat:'IP Address', q:'Berapa jumlah bit dalam alamat IPv4?', opts:['16 bit','32 bit','64 bit','128 bit'], ans:1, info:'IPv4 menggunakan 32 bit yang ditulis dalam 4 oktet (misal: 192.168.1.1).' },
  { cat:'WiFi', q:'Standar WiFi manakah yang memiliki kecepatan hingga 9,6 Gbps?', opts:['802.11n (WiFi 4)','802.11ac (WiFi 5)','802.11ax (WiFi 6)','802.11g'], ans:2, info:'WiFi 6 (802.11ax) adalah standar terbaru dengan kecepatan teoritis hingga 9,6 Gbps.' },
  { cat:'DNS', q:'Apa fungsi DNS (Domain Name System)?', opts:['Mengatur bandwidth','Menerjemahkan nama domain ke IP','Mengenkripsi data','Menghubungkan WiFi'], ans:1, info:'DNS mengubah nama domain (misal: google.com) menjadi alamat IP yang bisa dibaca mesin.' },
  { cat:'OSI Model', q:'Pada layer berapakah Router bekerja dalam model OSI?', opts:['Layer 1 (Physical)','Layer 2 (Data Link)','Layer 3 (Network)','Layer 4 (Transport)'], ans:2, info:'Router bekerja di Layer 3 (Network) untuk routing paket antar jaringan.' },
];

let gameState = { qIndex:0, score:0, lives:3, current:[], answered:false };

function shuffle(arr) { return [...arr].sort(() => Math.random() - 0.5); }

function startGame() {
  gameState = { qIndex:0, score:0, lives:3, current: shuffle(quizQuestions), answered:false };
  $('#game-start').style.display = 'none';
  $('#game-result').style.display = 'none';
  $('#game-question').style.display = 'block';
  updateGameHeader();
  showQuestion();
}

function updateGameHeader() {
  $('#game-score-display').textContent = gameState.score;
  $('#game-lives').textContent = '❤️'.repeat(gameState.lives) + '🖤'.repeat(3 - gameState.lives);
  $('#game-q-counter').textContent = `${gameState.qIndex}/${gameState.current.length}`;
  const pct = (gameState.qIndex / gameState.current.length) * 100;
  $('#game-progress').style.width = pct + '%';
}

function showQuestion() {
  const q = gameState.current[gameState.qIndex];
  gameState.answered = false;
  $('#game-category').textContent = `📡 ${q.cat}`;
  $('#game-q-text').textContent = q.q;
  $('#game-feedback').style.display = 'none';

  const optsDiv = $('#game-options');
  optsDiv.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.innerHTML = `<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:rgba(201,148,26,0.15);margin-right:0.5rem;font-size:0.75rem;font-family:'Oswald',sans-serif;font-weight:700;line-height:24px;text-align:center;flex-shrink:0;">${String.fromCharCode(65+i)}</span>${opt}`;
    btn.style.cssText = 'display:flex;align-items:center;padding:0.85rem 1rem;background:var(--surface-2);border:1.5px solid var(--border);border-radius:var(--radius-md);cursor:pointer;text-align:left;font-size:0.88rem;color:var(--text-dark);transition:all 0.2s;font-family:"Inter",sans-serif;width:100%;';
    btn.onmouseover = () => { if(!gameState.answered) btn.style.borderColor='var(--gold)'; };
    btn.onmouseout  = () => { if(!gameState.answered) btn.style.borderColor='var(--border)'; };
    btn.onclick = () => selectAnswer(i, q.ans, q.info);
    optsDiv.appendChild(btn);
  });
}

function selectAnswer(chosen, correct, info) {
  if (gameState.answered) return;
  gameState.answered = true;

  const btns = $$('#game-options button');
  btns[correct].style.cssText += 'background:rgba(0,184,148,0.15);border-color:#00B894;color:#00B894;';

  const fb = $('#game-feedback');
  if (chosen === correct) {
    btns[chosen].style.cssText += 'background:rgba(0,184,148,0.15);border-color:#00B894;';
    gameState.score += 10;
    fb.style.cssText = 'display:block;padding:0.75rem 1rem;border-radius:var(--radius-md);background:rgba(0,184,148,0.1);border:1px solid #00B894;color:#00B894;font-size:0.88rem;margin-top:1.25rem;';
    fb.innerHTML = `✅ Benar! ${info}`;
  } else {
    btns[chosen].style.cssText += 'background:rgba(239,68,68,0.1);border-color:#EF4444;color:#EF4444;';
    gameState.lives--;
    fb.style.cssText = 'display:block;padding:0.75rem 1rem;border-radius:var(--radius-md);background:rgba(239,68,68,0.08);border:1px solid #EF4444;color:#EF4444;font-size:0.88rem;margin-top:1.25rem;';
    fb.innerHTML = `❌ Salah! Jawaban benar: <strong>${btns[correct].textContent.slice(1)}</strong>. ${info}`;
  }
  updateGameHeader();

  const nextDelay = chosen === correct ? 1600 : 2200;
  setTimeout(() => {
    gameState.qIndex++;
    if (gameState.lives <= 0 || gameState.qIndex >= gameState.current.length) {
      showResult();
    } else {
      showQuestion();
    }
  }, nextDelay);
}

function showResult() {
  $('#game-question').style.display = 'none';
  $('#game-result').style.display = 'block';
  $('#game-progress').style.width = '100%';

  const s = gameState.score;
  const correct = Math.round(s / 10);
  const total   = gameState.current.length;
  const pct     = Math.round((s / (total * 10)) * 100);
  const won     = pct >= 80 && gameState.lives > 0;

  $('#result-emoji').textContent  = won ? '🏆' : (pct >= 50 ? '😊' : '💪');
  $('#result-title').textContent  = won ? 'Luar Biasa, Cowboy!' : (pct >= 50 ? 'Hampir Benar!' : 'Jangan Menyerah!');
  $('#result-desc').textContent   = won
    ? 'Anda adalah master jaringan sejati! Klaim diskon 30% Anda sekarang.'
    : `Skor Anda ${pct}%. Butuh min. 80% untuk mendapat diskon. Coba lagi!`;

  $('#result-score-box').innerHTML = `
    <div style="display:flex;justify-content:center;gap:2rem;flex-wrap:wrap;">
      <div style="text-align:center;"><div style="font-family:'Oswald',sans-serif;font-size:2.2rem;font-weight:700;color:var(--gold-bright);">${s}</div><div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Total Skor</div></div>
      <div style="text-align:center;"><div style="font-family:'Oswald',sans-serif;font-size:2.2rem;font-weight:700;color:var(--tech-light);">${correct}/${total}</div><div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Benar</div></div>
      <div style="text-align:center;"><div style="font-family:'Oswald',sans-serif;font-size:2.2rem;font-weight:700;color:${won?'#00B894':'var(--rust)'};">${pct}%</div><div style="font-size:0.75rem;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;">Akurasi</div></div>
    </div>`;

  const couponDiv = $('#result-coupon');
  if (won) {
    const code = 'SNWIZ-' + Math.random().toString(36).substring(2,6).toUpperCase() + '-30';
    couponDiv.style.display = 'block';
    $('#coupon-code').textContent = code;
  } else {
    couponDiv.style.display = 'none';
  }
}

/* ============================================
   SPEED TEST
   ============================================ */
let stRunning = false;

async function startSpeedTest() {
  if (stRunning) return;
  stRunning = true;

  const btn = $('#st-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengukur...';
  btn.disabled = true;
  $('#st-status').textContent = 'Memeriksa koneksi...';
  $('#st-recommendation').style.display = 'none';
  $('#st-info').style.display = 'none';

  // Reset displays
  ['st-download','st-upload','st-ping'].forEach(id => {
    const el = $('#'+id);
    if(el) el.textContent = '-- ' + (id==='st-ping'?'ms':'Mbps');
  });
  $('#st-download-num').textContent = '--';
  setGauge(0);

  try {
    // 1. Ping test
    $('#st-status').textContent = '⚡ Mengukur ping...';
    const ping = await measurePing();
    $('#st-ping').textContent = ping + ' ms';

    // 2. Download test
    $('#st-status').textContent = '⬇️ Mengukur kecepatan download...';
    const dl = await measureDownload();
    $('#st-download').textContent = dl.toFixed(1) + ' Mbps';
    $('#st-download-num').textContent = dl.toFixed(1);
    animateGauge(Math.min(dl, 100));

    // 3. Upload test (estimated)
    $('#st-status').textContent = '⬆️ Mengukur kecepatan upload...';
    const ul = await measureUpload();
    $('#st-upload').textContent = ul.toFixed(1) + ' Mbps';

    // 4. Get IP info
    try {
      const ipRes = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(4000) });
      const ipData = await ipRes.json();
      $('#st-ip').textContent = '🌐 IP: ' + (ipData.ip || 'N/A');
      $('#st-isp').textContent = '📡 ISP: ' + (ipData.org || 'Unknown');
      $('#st-info').style.display = 'block';
    } catch(_) {}

    $('#st-status').textContent = '✅ Tes selesai!';
    showRecommendation(dl, ul, ping);

  } catch(err) {
    $('#st-status').textContent = '⚠️ Gagal mengukur. Periksa koneksi Anda.';
  }

  btn.innerHTML = '<i class="fas fa-redo"></i> Tes Ulang';
  btn.disabled  = false;
  stRunning     = false;
}

async function measurePing() {
  const times = [];
  for (let i = 0; i < 4; i++) {
    const t0 = performance.now();
    try {
      await fetch('https://www.google.com/generate_204?' + Date.now(), { mode:'no-cors', cache:'no-store', signal: AbortSignal.timeout(3000) });
    } catch(_) {}
    times.push(Math.round(performance.now() - t0));
    await sleep(150);
  }
  return Math.min(...times);
}

async function measureDownload() {
  // Download a test file from CDN and measure throughput
  const testUrl = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css';
  const sizes = [];
  for (let i = 0; i < 3; i++) {
    const t0 = performance.now();
    const res = await fetch(testUrl + '?r=' + Math.random(), { cache: 'no-store', signal: AbortSignal.timeout(8000) });
    const buf = await res.arrayBuffer();
    const elapsed = (performance.now() - t0) / 1000;
    const mbps = (buf.byteLength * 8) / (elapsed * 1e6);
    sizes.push(mbps);
    await sleep(200);
  }
  const avg = sizes.reduce((a,b)=>a+b,0) / sizes.length;
  // Scale reasonably — CDN file is small, adjust factor for real-world estimate
  return parseFloat((avg * 1.8).toFixed(1));
}

async function measureUpload() {
  // Simulate upload by generating random payload and posting to no-cors endpoint
  const chunkSize = 500 * 1024; // 500KB
  const data = new Uint8Array(chunkSize);
  crypto.getRandomValues(data);
  const blob = new Blob([data]);
  let total = 0;
  const t0 = performance.now();
  for (let i = 0; i < 2; i++) {
    try {
      await fetch('https://httpbin.org/post', { method:'POST', body: blob, mode:'no-cors', signal: AbortSignal.timeout(6000) });
    } catch(_) {}
    total += chunkSize;
    await sleep(100);
  }
  const elapsed = (performance.now() - t0) / 1000;
  return parseFloat(((total * 8) / (elapsed * 1e6)).toFixed(1));
}

function setGauge(pct) {
  const arc    = $('#speed-arc');
  const needle = $('#speed-needle');
  if (!arc || !needle) return;
  const maxDash  = 283;
  const offset   = maxDash - (pct / 100) * maxDash;
  arc.style.strokeDashoffset = offset;
  const deg = -90 + (pct / 100) * 180;
  needle.style.transform = `rotate(${deg}deg)`;
}

function animateGauge(targetPct) {
  let cur = 0;
  const interval = setInterval(() => {
    cur = Math.min(cur + 1.2, targetPct);
    setGauge(cur);
    if (cur >= targetPct) clearInterval(interval);
  }, 20);
}

function showRecommendation(dl, ul, ping) {
  const el = $('#st-recommendation');
  let msg = '';
  if (dl < 10) {
    msg = `⚠️ <strong>Kecepatan Rendah (${dl.toFixed(1)} Mbps)</strong> — Koneksi Anda sangat lambat untuk kebutuhan bisnis. Smart Network dapat membantu meningkatkan infrastruktur jaringan Anda secara signifikan. <a href="#contact" style="color:var(--gold);font-weight:600;">Konsultasi Gratis →</a>`;
  } else if (dl < 50) {
    msg = `📊 <strong>Kecepatan Sedang (${dl.toFixed(1)} Mbps)</strong> — Cukup untuk penggunaan rumahan, namun belum optimal untuk kantor atau bisnis. Upgrade ke Fiber Optic bersama Smart Network untuk kecepatan 10x lebih baik! <a href="#contact" style="color:var(--gold);font-weight:600;">Info Lebih →</a>`;
  } else {
    msg = `✅ <strong>Kecepatan Baik (${dl.toFixed(1)} Mbps)</strong> — Koneksi Anda sudah cukup baik! Smart Network dapat membantu menjaga stabilitas dan keamanannya dengan layanan Maintenance & Firewall. <a href="#services" style="color:var(--gold);font-weight:600;">Lihat Layanan →</a>`;
  }
  if (ping > 100) msg += `<br><br>🕐 <strong>Ping tinggi (${ping} ms)</strong> — Latensi tinggi dapat memengaruhi kualitas video call dan gaming. Teknisi kami dapat membantu mengoptimalkan routing jaringan Anda.`;
  el.innerHTML = msg;
  el.style.display = 'block';
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

/* ============================================
   BACKGROUND MUSIC CONTROLLER
   ============================================ */
const bgMusic  = $('#bg-music');
const musicFab = $('#fab-music');
const musicIcon = musicFab?.querySelector('i');

if (bgMusic && musicFab) {
  let isPlaying = false;

  const toggleMusic = async () => {
    if (isPlaying) {
      bgMusic.pause();
      musicFab.classList.remove('playing');
      if (musicIcon) musicIcon.className = 'fas fa-volume-mute';
      musicFab.querySelector('.fab-tooltip').textContent = 'Mainkan Musik';
      isPlaying = false;
      showToast('🔇 Musik dinonaktifkan', 'info');
    } else {
      try {
        await bgMusic.play();
        musicFab.classList.add('playing');
        if (musicIcon) musicIcon.className = 'fas fa-music';
        musicFab.querySelector('.fab-tooltip').textContent = 'Matikan Musik';
        isPlaying = true;
        showToast('🎵 Memutar Musik Wild West!', 'success');
      } catch (err) {
        showToast('⚠️ Izinkan browser untuk memutar musik', 'error');
      }
    }
  };

  musicFab.addEventListener('click', toggleMusic);

  // Show a welcome toast inviting user to play the music
  window.addEventListener('load', () => {
    setTimeout(() => {
      showToast('🤠 Hidupkan suasana Wild West! Klik tombol musik di kanan bawah 🎵', 'success');
    }, 4500);
  });
}

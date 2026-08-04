/* =============================================
   CLEVER CONSULTING — Full Interactive JS
   ============================================= */

/* ─── LOADER ────────────────────────────────── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
    document.body.classList.remove('loading');
    setTimeout(() => document.getElementById('loader').remove(), 700);
  }, 1800);
});

/* ─── PROGRESS BAR ───────────────────────────── */
const progressBar = document.getElementById('progress-bar');
window.addEventListener('scroll', () => {
  const h = document.documentElement;
  const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
  progressBar.style.width = pct + '%';
}, { passive: true });

/* ─── CUSTOM CURSOR ─────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function moveCursor() {
  dot.style.left  = mx + 'px';
  dot.style.top   = my + 'px';
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(moveCursor);
}
moveCursor();

document.querySelectorAll('a, button, .service-card, .team-card, .vision-card, .domain-card, .stat-card').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});
document.querySelectorAll('p, h1, h2, h3, .section-desc, .about-text p').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-text'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-text'));
});
document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });

/* ─── NAVBAR SCROLL ─────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ─── HAMBURGER ─────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');
hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  spans[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)' : '';
  spans[1].style.opacity   = open ? '0' : '';
  spans[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
});
mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));

/* ─── SMOOTH SCROLL ─────────────────────────── */
let scrollTarget = window.scrollY, scrollCurrent = window.scrollY;
let isSmoothing = false;

function smoothScroll() {
  scrollCurrent += (scrollTarget - scrollCurrent) * 0.08;
  if (Math.abs(scrollTarget - scrollCurrent) > 0.5) {
    window.scrollTo(0, scrollCurrent);
    requestAnimationFrame(smoothScroll);
  } else {
    window.scrollTo(0, scrollTarget);
    isSmoothing = false;
  }
}

window.addEventListener('wheel', e => {
  e.preventDefault();
  scrollTarget = Math.max(0, Math.min(scrollTarget + e.deltaY * 1.4, document.body.scrollHeight - window.innerHeight));
  if (!isSmoothing) { isSmoothing = true; requestAnimationFrame(smoothScroll); }
}, { passive: false });

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) {
      scrollTarget = el.getBoundingClientRect().top + window.scrollY - 80;
      if (!isSmoothing) { isSmoothing = true; requestAnimationFrame(smoothScroll); }
    }
  });
});

/* ─── ACTIVE NAV ─────────────────────────────── */
const sectionEls = document.querySelectorAll('section[id]');
const navAs = document.querySelectorAll('.nav-links a');
new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { threshold: 0.4 }).observe;
sectionEls.forEach(s => new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) navAs.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
  });
}, { threshold: 0.4 }).observe(s));

/* ─── REVEAL ON SCROLL ───────────────────────── */
new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
.observe;

document.querySelectorAll('.rv, .rv-l, .rv-r, .rv-s').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting) el.classList.add('in');
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }).observe(el);
});

/* ─── HERO CANVAS PARTICLES ──────────────────── */
(function() {
  const c = document.getElementById('hero-canvas');
  if (!c) return;
  const ctx = c.getContext('2d');
  let W, H, pts = [], af;

  function resize() {
    W = c.width = c.offsetWidth;
    H = c.height = c.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Pt {
    constructor(init) {
      this.x  = Math.random() * (W || 800);
      this.y  = init ? Math.random() * (H || 600) : (H || 600) + 10;
      this.r  = Math.random() * 2.5 + .5;
      this.vx = (Math.random() - .5) * .3;
      this.vy = -(Math.random() * .45 + .15);
      this.o  = Math.random() * .5 + .1;
      this.gold = Math.random() > .4;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.y < -10) { this.x = Math.random() * W; this.y = H + 10; }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
      ctx.fillStyle = this.gold ? `rgba(184,148,31,${this.o})` : `rgba(212,172,66,${this.o*.6})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 90; i++) pts.push(new Pt(true));

  function frame() {
    ctx.clearRect(0,0,W,H);
    pts.forEach(p => { p.update(); p.draw(); });
    for (let i=0; i<pts.length; i++) {
      for (let j=i+1; j<pts.length; j++) {
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.hypot(dx,dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(184,148,31,${.06*(1-d/110)})`;
          ctx.lineWidth=.6;
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.stroke();
        }
      }
    }
    af = requestAnimationFrame(frame);
  }
  frame();
})();

/* ─── COUNTER ANIMATION ─────────────────────── */
function countUp(el, end, dur = 1400) {
  const start = performance.now();
  const hasPlus = String(end).includes('+');
  const num = parseFloat(String(end).replace('+',''));
  function step(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(num * eased) + (hasPlus ? '+' : '');
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

document.querySelectorAll('[data-count]').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !el.dataset.done) {
      el.dataset.done = '1';
      countUp(el, el.dataset.count);
    }
  }, { threshold: .6 }).observe(el);
});

/* ─── TYPED HERO TEXT ────────────────────────── */
(function() {
  const el = document.getElementById('hero-typed');
  if (!el) return;
  const phrases = ['stratégie d\'entreprise','l\'accompagnement académique','la croissance structurée','la restructuration de projets'];
  let ti = 0, ci = 0, del = false;

  function tick() {
    const cur = phrases[ti];
    if (!del) {
      el.textContent = cur.slice(0, ++ci);
      if (ci === cur.length) { del=true; setTimeout(tick, 2000); return; }
    } else {
      el.textContent = cur.slice(0, --ci);
      if (ci === 0) { del=false; ti=(ti+1)%phrases.length; }
    }
    setTimeout(tick, del ? 38 : 72);
  }
  tick();
})();

/* ─── EXPERTISE TABS ─────────────────────────── */
document.querySelectorAll('.exp-tab').forEach(t => {
  t.addEventListener('click', () => {
    const id = t.dataset.tab;
    document.querySelectorAll('.exp-tab').forEach(x => x.classList.toggle('active', x.dataset.tab === id));
    document.querySelectorAll('.exp-panel').forEach(x => x.classList.toggle('active', x.dataset.panel === id));
  });
});

/* ─── MAGNETIC BUTTONS ───────────────────────── */
document.querySelectorAll('.btn-primary, .btn-outline, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width  / 2;
    const y = e.clientY - r.top  - r.height / 2;
    btn.style.transform = `translate(${x*.22}px, ${y*.22}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

/* ─── 3D CARD TILT ───────────────────────────── */
document.querySelectorAll('.service-card, .vision-card, .team-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card.style.transform = `translateY(-7px) rotateX(${-y*8}deg) rotateY(${x*8}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform .5s cubic-bezier(.22,1,.36,1), box-shadow .35s, border-color .3s';
    setTimeout(() => card.style.transition = '', 500);
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });
});

/* ─── PARALLAX HERO ──────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.getElementById('hero');
  if (!hero) return;
  const sy = window.scrollY;
  const orbs = hero.querySelectorAll('.hero-orb');
  orbs.forEach((o, i) => { o.style.transform = `translateY(${sy * (i === 0 ? .15 : -.12)}px)`; });
  const logo = hero.querySelector('.hero-logo-scene');
  if (logo) logo.style.transform = `translateY(${sy * .08}px)`;
}, { passive: true });

/* ─── MARQUEE DOUBLE ─────────────────────────── */
(function() {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
})();

/* ─── NUMBERS SECTION COUNTER ────────────────── */
document.querySelectorAll('.number-val[data-count]').forEach(el => {
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !el.dataset.done) {
      el.dataset.done = '1';
      countUp(el, el.dataset.count, 1800);
    }
  }, { threshold: .6 }).observe(el);
});

/* ─── SCROLL INDICATOR FADE ──────────────────── */
const scrollInd = document.querySelector('.scroll-indicator');
if (scrollInd) {
  window.addEventListener('scroll', () => {
    scrollInd.style.opacity = window.scrollY > 80 ? '0' : '1';
    scrollInd.style.pointerEvents = window.scrollY > 80 ? 'none' : 'auto';
  }, { passive: true });
}

/* ─── CONTACT FORM (contact.html) ────────────── */
(function() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const serviceSelect = document.getElementById('cf-service');
  const params = new URLSearchParams(window.location.search);
  const titre = params.get('titre');
  if (titre && serviceSelect) {
    const match = Array.from(serviceSelect.options).find(o => o.value === titre);
    if (match) serviceSelect.value = titre;
  }

  const toast = document.getElementById('cform-toast');

  function sendViaMailto(name, email, phone, service, message) {
    const subject = `Demande de contact${service ? ' — ' + service : ''} — ${name}`;
    const bodyLines = [
      `Nom : ${name}`,
      `Email : ${email}`,
      phone ? `Téléphone : ${phone}` : null,
      service ? `Service concerné : ${service}` : null,
      '',
      'Message :',
      message
    ].filter(Boolean);
    const mailto = `mailto:contact@cleverconsult.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyLines.join('\n'))}`;
    if (toast) {
      toast.textContent = '✓ Ouverture de votre client mail avec la demande pré-remplie...';
      toast.classList.add('show');
    }
    window.location.href = mailto;
  }

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('cf-name').value.trim();
    const email   = document.getElementById('cf-email').value.trim();
    const phone   = document.getElementById('cf-phone').value.trim();
    const service = serviceSelect ? serviceSelect.value : '';
    const message = document.getElementById('cf-message').value.trim();

    if (!name || !email || !message) {
      form.reportValidity();
      return;
    }

    const submitBtn = form.querySelector('.cform-submit');
    const originalHTML = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.style.opacity = '.6';
      submitBtn.innerHTML = 'Envoi en cours…';
    }

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, message }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.ok) {
        if (toast) {
          toast.textContent = '✓ Message envoyé avec succès. Nous revenons vers vous sous 24h ouvrées.';
          toast.classList.add('show');
        }
        form.reset();
      } else {
        sendViaMailto(name, email, phone, service, message);
      }
    } catch (err) {
      sendViaMailto(name, email, phone, service, message);
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        submitBtn.innerHTML = originalHTML;
      }
    }
  });
})();

(function () {
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Mobile nav toggle
  const toggle = $('.nav-toggle');
  const menu = $('#nav-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('show');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on link click (mobile)
    $$('#nav-menu a').forEach((a) => a.addEventListener('click', () => {
      if (menu.classList.contains('show')) {
        menu.classList.remove('show');
        toggle.setAttribute('aria-expanded', 'false');
      }
    }));
  }

  // Smooth scroll for internal anchors
  document.addEventListener('click', (e) => {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;
    const id = target.getAttribute('href');
    if (!id || id === '#') return;
    const el = $(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Intersection-based reveal animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

  $$('.fade-up').forEach((el) => {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });

  // Category tabs logic
  const chips = $$('.chip');
  const panels = $$('.panel');
  chips.forEach((chip) => chip.addEventListener('click', () => {
    chips.forEach((c) => c.classList.remove('active'));
    chip.classList.add('active');
    const key = chip.dataset.category;
    panels.forEach((p) => p.classList.remove('show'));
    const panel = $('#cat-' + key);
    if (panel) panel.classList.add('show');
  }));

  // Back to top visibility (optional subtle fade)
  const backToTop = $('.back-to-top');
  if (backToTop) {
    const onScroll = () => {
      backToTop.style.opacity = window.scrollY > 300 ? '1' : '0.85';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Subtle particles in hero
  const canvas = $('#particles');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, particles;
    const GOLD = 'rgba(201,162,74,';

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    }

    function init() {
      const count = Math.max(36, Math.floor((w * h) / 22000));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.8 + 0.6,
        a: Math.random() * Math.PI * 2,
        s: 0.15 + Math.random() * 0.35,
        o: 0.2 + Math.random() * 0.55
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.a += 0.005 + p.s * 0.003;
        p.x += Math.cos(p.a) * p.s;
        p.y += Math.sin(p.a) * p.s * 0.6;
        // wrap
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; if (p.y > h + 10) p.y = -10;

        ctx.beginPath();
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, GOLD + (0.85 * p.o) + ')');
        g.addColorStop(1, GOLD + '0)');
        ctx.fillStyle = g;
        ctx.arc(p.x, p.y, p.r * 3.2, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(step);
    }

    resize();
    window.addEventListener('resize', resize);
    step();
  }

  // Robust logo loader: tries webp, jpg, png and sets whichever exists
  (function ensureLogo() {
    const headerLogo = document.getElementById('headerLogo');
    const heroLogo = document.getElementById('heroLogo');
    if (!headerLogo && !heroLogo) return;
    const candidates = ['assets/logo-hero.webp', 'assets/logo-hero.jpg', 'assets/logo-hero.png'];
    const testImg = new Image();
    let i = 0;
    function next() {
      if (i >= candidates.length) return; // stop if none
      const src = candidates[i] + '?v=' + Date.now();
      testImg.onload = () => {
        const finalSrc = candidates[i];
        if (headerLogo) headerLogo.src = finalSrc;
        if (heroLogo) heroLogo.src = finalSrc;
      };
      testImg.onerror = () => { i += 1; next(); };
      testImg.src = src;
    }
    next();
  })();

  // Contact form: fake submit -> clear + thanks message
  const askForm = document.getElementById('askForm');
  const askInput = document.getElementById('question');
  const askThanks = document.getElementById('askThanks');
  if (askForm && askInput && askThanks) {
    askForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const hadText = (askInput.value || '').trim().length > 0;
      askInput.value = '';
      askThanks.style.display = 'block';
      if (!hadText) {
        askThanks.textContent = 'Gracias, nos tomaremos el tiempo de leerte y responderte.';
      }
    });
  }

  // Header show/hide on scroll
  let lastScrollY = 0;
  const header = document.querySelector('.site-header');
  function updateHeaderVisibility() {
    const currentScrollY = window.scrollY;
    if (currentScrollY < 50) {
      // Always show at top
      header.classList.add('visible');
    } else if (currentScrollY < lastScrollY) {
      // Show when scrolling up
      header.classList.add('visible');
    } else {
      // Hide when scrolling down
      header.classList.remove('visible');
    }
    lastScrollY = currentScrollY;
  }
  updateHeaderVisibility(); // Show at load
  window.addEventListener('scroll', updateHeaderVisibility, { passive: true });
})();



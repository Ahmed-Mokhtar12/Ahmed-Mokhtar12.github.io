/* =========================================================
   Ahmed Mokhtar — Portfolio interactions
   Plain JS, no dependencies.
   ========================================================= */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (persisted) ---------- */
  const THEME_KEY = 'am-portfolio-theme';
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');

  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === 'light' || savedTheme === 'dark') {
    root.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      root.setAttribute('data-theme', next);
      localStorage.setItem(THEME_KEY, next);
    });
  }

  /* ---------- Mobile nav ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      const open = navLinks.classList.toggle('is-open');
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  /* ---------- Nav shadow on scroll ---------- */
  const nav = document.getElementById('nav');
  function onScrollNav() {
    if (nav) nav.classList.toggle('is-scrolled', window.scrollY > 12);
  }
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  /* ---------- Scroll-spy active nav link ---------- */
  const sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));
  const linkMap = {};
  document.querySelectorAll('.nav__link').forEach(function (link) {
    const id = link.getAttribute('href').replace('#', '');
    linkMap[id] = link;
  });

  if ('IntersectionObserver' in window && sections.length) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.values(linkMap).forEach(function (l) { l.classList.remove('is-active'); });
          const active = linkMap[entry.target.id];
          if (active) active.classList.add('is-active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    const revealObs = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function (el) { revealObs.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');

  function animateCount(el) {
    const target = parseFloat(el.getAttribute('data-count')) || 0;
    const suffix = el.getAttribute('data-suffix') || '';
    if (prefersReducedMotion) { el.textContent = target + suffix; return; }

    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(eased * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      const countObs = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(function (c) { countObs.observe(c); });
    }
  }

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Boot-sequence typing (hero) ---------- */
  const bootLines = document.querySelectorAll('.boot-line');
  if (bootLines.length) {
    if (prefersReducedMotion) {
      bootLines.forEach(function (line) { line.textContent = line.getAttribute('data-text') || ''; });
    } else {
      let i = 0;
      function typeLine() {
        if (i >= bootLines.length) return;
        const line = bootLines[i];
        const text = line.getAttribute('data-text') || '';
        line.classList.add('is-typing');
        let c = 0;
        const speed = 16;
        (function step() {
          line.textContent = text.slice(0, c);
          c++;
          if (c <= text.length) {
            setTimeout(step, speed);
          } else {
            line.classList.remove('is-typing');
            i++;
            setTimeout(typeLine, 120);
          }
        })();
      }
      typeLine();
    }
  }

  /* ---------- Button cursor-glow (radial highlight follows pointer) ---------- */
  if (!prefersReducedMotion) {
    document.querySelectorAll('[data-glow]').forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        el.style.setProperty('--my', (e.clientY - rect.top) + 'px');
      });
    });
  }

  /* ---------- Neural / automation-pulse network (hero signature) ---------- */
  (function initNeuralCanvas() {
    const canvas = document.getElementById('neuralCanvas');
    const hero = document.getElementById('hero');
    if (!canvas || !hero || !canvas.getContext) return;

    const ctx = canvas.getContext('2d');
    let width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let nodes = [];
    let pulses = [];
    let rafId = null;

    const NODE_COUNT = 26;
    const LINK_DIST = 170;

    function getAccentColors() {
      const styles = getComputedStyle(document.documentElement);
      return {
        signal: styles.getPropertyValue('--signal').trim() || '#3fe8c8',
        pulse: styles.getPropertyValue('--pulse').trim() || '#8b7bff',
        line: styles.getPropertyValue('--line-bright').trim() || '#34406e'
      };
    }

    function resize() {
      const rect = hero.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      nodes = [];
      for (let n = 0; n < NODE_COUNT; n++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.18,
          vy: (Math.random() - 0.5) * 0.18
        });
      }
    }

    function maybeSpawnPulse() {
      if (Math.random() > 0.02 || nodes.length < 2) return;
      const a = nodes[Math.floor(Math.random() * nodes.length)];
      let b = nodes[Math.floor(Math.random() * nodes.length)];
      let tries = 0;
      while (b === a && tries < 5) { b = nodes[Math.floor(Math.random() * nodes.length)]; tries++; }
      const dx = a.x - b.x, dy = a.y - b.y;
      if (Math.sqrt(dx * dx + dy * dy) < LINK_DIST * 1.3) {
        pulses.push({ a: a, b: b, t: 0 });
      }
    }

    function draw() {
      const c = getAccentColors();
      ctx.clearRect(0, 0, width, height);

      // move nodes
      nodes.forEach(function (node) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
      });

      // links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.strokeStyle = c.line;
            ctx.globalAlpha = (1 - dist / LINK_DIST) * 0.35;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // nodes
      ctx.globalAlpha = 1;
      nodes.forEach(function (node) {
        ctx.fillStyle = c.signal;
        ctx.globalAlpha = 0.55;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      });

      // pulses (data traveling between nodes = automation signal)
      maybeSpawnPulse();
      pulses = pulses.filter(function (p) { return p.t < 1; });
      pulses.forEach(function (p) {
        p.t += 0.012;
        const x = p.a.x + (p.b.x - p.a.x) * p.t;
        const y = p.a.y + (p.b.y - p.a.y) * p.t;
        ctx.globalAlpha = 1 - Math.abs(p.t - 0.5) * 0.6;
        ctx.fillStyle = c.pulse;
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowColor = c.pulse;
        ctx.shadowBlur = 8;
      });
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      rafId = requestAnimationFrame(draw);
    }

    resize();
    makeNodes();

    if (prefersReducedMotion) {
      draw(); // single static-ish frame; no rAF loop continuation needed beyond first paint
      cancelAnimationFrame(rafId);
    } else {
      draw();
    }

    let resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        resize();
        makeNodes();
      }, 200);
    });

    // Pause when hero is off-screen to save CPU
    if ('IntersectionObserver' in window) {
      const heroObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            if (!rafId) draw();
          } else if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
          }
        });
      });
      heroObs.observe(hero);
    }
  })();
})();

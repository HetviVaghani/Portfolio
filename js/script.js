/* =========================================================
   HETVI — ART PORTFOLIO SCRIPT
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- Smooth (inertia) scrolling via Lenis, with graceful fallback ---------- */
  let lenis = null;
  if (typeof Lenis !== 'undefined' && !isTouch && !reduceMotion) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    window.lenis = lenis;
    lenis.stop();
    const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  function scrollToTarget(target) {
    if (lenis) lenis.scrollTo(target, { offset: -70 });
    else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' });
  }

  $$('a[href^="#"]').forEach((link) => {
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const targetEl = document.querySelector(id);
    if (!targetEl) return;
    link.addEventListener('click', (e) => {
      if (link.parentElement.classList.contains('has-dropdown') && !link.parentElement.classList.contains('open') && window.innerWidth <= 860) return;
      e.preventDefault();
      closeNav();
      scrollToTarget(targetEl);
    });
  });

  /* ---------- Preloader with counter ---------- */
  const preloader = $('#preloader');
  const countEl = $('#preloaderCount');
  let loaded = false;
  let count = 0;
  const counter = setInterval(() => {
    count = Math.min(count + (loaded ? 9 : Math.random() * 6), loaded ? 100 : 90);
    if (countEl) countEl.textContent = Math.round(count);
    if (count >= 100) { clearInterval(counter); setTimeout(finishLoading, 250); }
  }, 40);
  let finished = false;
  function finishLoading() {
    if (finished) return;
    finished = true;
    preloader.classList.add('done');
    document.body.classList.remove('loading');
    document.documentElement.classList.add('hero-ready');
    if (lenis) lenis.start();
  }
  window.addEventListener('load', () => { loaded = true; });
  setTimeout(() => { loaded = true; }, 2600);   // don't wait forever on the video
  setTimeout(finishLoading, 5000);               // hard fallback

  /* ---------- Footer year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Hero name → animated letters ---------- */
  const heroName = $('#heroName');
  if (heroName) {
    const text = heroName.textContent;
    heroName.textContent = '';
    [...text].forEach((ch, i) => {
      const outer = document.createElement('span');
      outer.className = 'char';
      outer.style.setProperty('--i', i);
      const inner = document.createElement('span');
      inner.textContent = ch;
      outer.appendChild(inner);
      heroName.appendChild(outer);
    });
  }

  /* ---------- Rotating word in hero ---------- */
  const rotator = $('#rotator');
  if (rotator) {
    const words = $$('span', rotator);
    let idx = 0;
    setInterval(() => {
      const cur = words[idx];
      idx = (idx + 1) % words.length;
      const next = words[idx];
      cur.classList.remove('is-active');
      cur.classList.add('is-leaving');
      next.classList.remove('is-leaving');
      next.classList.add('is-active');
      setTimeout(() => cur.classList.remove('is-leaving'), 800);
    }, 2400);
  }

  /* ---------- Hero video: play/pause badge + scroll parallax ---------- */
  const video = $('#heroVideo');
  const videoToggle = $('#videoToggle');
  if (video && videoToggle) {
    videoToggle.addEventListener('click', () => {
      if (video.paused) { video.play(); videoToggle.classList.remove('paused'); videoToggle.setAttribute('aria-label', 'Pause background video'); }
      else { video.pause(); videoToggle.classList.add('paused'); videoToggle.setAttribute('aria-label', 'Play background video'); }
    });
    if (reduceMotion) { video.pause(); videoToggle.classList.add('paused'); }
  }
  const heroMedia = $('#heroMedia');
  const heroEl = $('.hero');

  /* ---------- Split headings into words for the mask reveal ---------- */
  $$('.split').forEach((el) => {
    let w = 0;
    const walk = (node, into) => {
      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { into.appendChild(document.createTextNode(' ')); return; }
            const word = document.createElement('span');
            word.className = 'word';
            const inner = document.createElement('span');
            inner.style.setProperty('--w', w++);
            inner.textContent = part;
            word.appendChild(inner);
            into.appendChild(word);
          });
        } else if (child.nodeType === 1) {
          const clone = child.cloneNode(false);
          walk(child, clone);
          into.appendChild(clone);
        }
      });
    };
    const frag = document.createDocumentFragment();
    walk(el, frag);
    el.textContent = '';
    el.appendChild(frag);
  });

  /* ---------- Stagger indexes per gallery ---------- */
  function restagger(gallery) {
    let i = 0;
    $$('.art', gallery).forEach((a) => {
      if (!a.classList.contains('is-hidden')) a.style.setProperty('--i', i++ % 6);
    });
  }
  $$('.gallery').forEach(restagger);

  /* ---------- Scroll reveal ---------- */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .reveal-img, .split, .art, .footer-big').forEach((el) => revealObserver.observe(el));

  /* ---------- Animated stat counters ---------- */
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / 1600, 1);
        el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach((el) => counterObserver.observe(el));

  /* ---------- Gallery filter chips (animated out → in) ---------- */
  $$('.chips').forEach((group) => {
    const gallery = document.getElementById('gallery-' + group.dataset.target);
    if (!gallery) return;
    const chips = $$('.chip', group);
    const items = $$('.art', gallery);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (chip.classList.contains('active')) return;
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;

        items.forEach((item) => { if (!item.classList.contains('is-hidden')) item.classList.add('is-hiding'); });
        setTimeout(() => {
          items.forEach((item) => {
            const match = filter === 'all' || item.dataset.category === filter;
            item.classList.remove('is-hiding', 'is-showing');
            item.classList.toggle('is-hidden', !match);
            if (match) {
              item.classList.add('in-view');
              void item.offsetWidth; // restart animation
              item.classList.add('is-showing');
            }
          });
          restagger(gallery);
          if (gallery.classList.contains('gallery--scroller')) { gallery.scrollTo({ left: 0 }); updateScrollerProgress(gallery); }
          if (lenis) lenis.resize();
        }, 340);
      });
    });
  });

  /* ---------- Horizontal scroller: drag, wheel-free, arrows, progress ---------- */
  function updateScrollerProgress(sc) {
    const bar = sc.closest('section').querySelector('.scroller-progress span');
    if (!bar) return;
    const max = sc.scrollWidth - sc.clientWidth;
    const visible = sc.clientWidth / sc.scrollWidth;
    const p = max > 0 ? sc.scrollLeft / max : 1;
    bar.style.transform = `scaleX(${Math.max(visible, 0.08) + (1 - Math.max(visible, 0.08)) * p})`;
  }
  $$('.gallery--scroller').forEach((sc) => {
    let down = false, startX = 0, startLeft = 0, moved = 0;
    sc.addEventListener('pointerdown', (e) => {
      if (e.pointerType !== 'mouse') return;
      down = true; moved = 0; startX = e.clientX; startLeft = sc.scrollLeft;
    });
    window.addEventListener('pointermove', (e) => {
      if (!down) return;
      const dx = e.clientX - startX;
      moved = Math.max(moved, Math.abs(dx));
      if (moved > 5) sc.classList.add('dragging');
      sc.scrollLeft = startLeft - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = false;
      setTimeout(() => sc.classList.remove('dragging'), 0);
    });
    // swallow the click that ends a drag so it doesn't open the lightbox
    sc.addEventListener('click', (e) => { if (moved > 5) { e.stopPropagation(); e.preventDefault(); } }, true);
    sc.addEventListener('scroll', () => updateScrollerProgress(sc), { passive: true });
    updateScrollerProgress(sc);

    $$('[data-scroll]', sc.closest('section')).forEach((btn) => {
      btn.addEventListener('click', () => {
        sc.scrollBy({ left: Number(btn.dataset.scroll) * sc.clientWidth * 0.7, behavior: 'smooth' });
      });
    });
  });
  window.addEventListener('resize', () => $$('.gallery--scroller').forEach(updateScrollerProgress));

  /* ---------- Magnetic buttons ---------- */
  if (!isTouch) {
    $$('.magnetic, .round-btn, .medium-arrow').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px, ${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- 3D tilt on texture-wall pieces ---------- */
  if (!isTouch) {
    $$('.gallery--wall .art').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateZ(10px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------- Header / progress / parallax on scroll ---------- */
  const header = $('#siteHeader');
  const progress = $('#scrollProgress');
  const backToTop = $('#backToTop');
  const workNums = $$('.work-num');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const p = docH > 0 ? y / docH : 0;

    header.classList.toggle('scrolled', y > 60);
    header.classList.toggle('hide', y > lastY && y > window.innerHeight * 0.9 && !document.body.classList.contains('nav-open'));
    lastY = y;

    if (progress) progress.style.transform = `scaleX(${p})`;
    if (backToTop) {
      backToTop.style.setProperty('--p', (p * 100).toFixed(1));
      backToTop.classList.toggle('visible', y > 600);
    }

    // hero video drifts & zooms as you leave
    if (heroMedia && heroEl && y < heroEl.offsetHeight) {
      const k = y / heroEl.offsetHeight;
      heroMedia.style.transform = `translateY(${y * 0.35}px) scale(${1 + k * 0.12})`;
    }

    // outlined section numbers drift
    workNums.forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      n.style.setProperty('--py', ((r.top - window.innerHeight / 2) * -0.15).toFixed(1) + 'px');
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) backToTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Mobile nav ---------- */
  const navToggle = $('#navToggle');
  function closeNav() {
    document.body.classList.remove('nav-open');
    $$('.has-dropdown.open').forEach((p) => p.classList.remove('open'));
    if (lenis) lenis.start();
  }
  navToggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('nav-open');
    if (lenis) open ? lenis.stop() : lenis.start();
  });
  $$('.has-dropdown > a').forEach((link) => {
    link.addEventListener('click', (e) => {
      if (window.innerWidth > 860) return;
      const parent = link.parentElement;
      if (!parent.classList.contains('open')) { e.preventDefault(); parent.classList.add('open'); }
    });
  });

  /* ---------- Scrollspy ---------- */
  const spyLinks = $$('.main-nav .nav-link');
  const portfolioIds = ['craft', 'portrait-sketches', 'acrylic-paintings', 'watercolour-paintings', 'god-goddess-paintings', 'texture-art'];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      let id = entry.target.id;
      if (portfolioIds.includes(id)) id = 'craft';
      spyLinks.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- Lightbox ---------- */
  const lightbox = $('#lightbox');
  const lbImg = $('#lightboxImg');
  const lbCap = $('#lightboxCaption');
  const lbCount = $('#lightboxCount');
  let group = [], current = 0;

  function render() {
    const fig = group[current];
    const img = $('img', fig);
    lbImg.style.opacity = 0;
    setTimeout(() => {
      lbImg.src = img.currentSrc || img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = $('.art-cat', fig)?.textContent || '';
      lbCount.textContent = `${String(current + 1).padStart(2, '0')} / ${String(group.length).padStart(2, '0')}`;
      lbImg.style.opacity = 1;
    }, 150);
  }
  lbImg.style.transition = 'opacity .25s';
  function openLb(g, i) {
    group = g; current = i; render();
    lightbox.classList.add('open'); lightbox.setAttribute('aria-hidden', 'false');
    if (lenis) lenis.stop(); else document.body.style.overflow = 'hidden';
  }
  function closeLb() {
    lightbox.classList.remove('open'); lightbox.setAttribute('aria-hidden', 'true');
    if (lenis) lenis.start(); else document.body.style.overflow = '';
  }
  $$('.art').forEach((fig) => {
    fig.addEventListener('click', () => {
      const visible = $$('.art', fig.closest('.gallery')).filter((f) => !f.classList.contains('is-hidden'));
      openLb(visible, visible.indexOf(fig));
    });
  });
  const step = (d) => { current = (current + d + group.length) % group.length; render(); };
  $('#lightboxClose').addEventListener('click', closeLb);
  $('#lightboxPrev').addEventListener('click', () => step(-1));
  $('#lightboxNext').addEventListener('click', () => step(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLb(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') step(-1);
    if (e.key === 'ArrowRight') step(1);
  });
});

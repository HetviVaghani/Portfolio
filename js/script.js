// ===== Hetvi Portfolio — interactions =====

document.getElementById('year').textContent = new Date().getFullYear();

/* Navbar background on scroll + active link highlight + sliding indicator */
const navbar = document.getElementById('navbar');
const navLinksList = document.querySelectorAll('.nav-link');
const navIndicator = document.getElementById('navIndicator');
const navLinksWrap = document.getElementById('navLinks');

function moveIndicatorTo(link){
  if(!link || !navIndicator) return;
  const wrapRect = navLinksWrap.getBoundingClientRect();
  const rect = link.getBoundingClientRect();
  navIndicator.style.left = (rect.left - wrapRect.left) + 'px';
  navIndicator.style.width = rect.width + 'px';
}

function currentActiveLink(){
  return document.querySelector('.nav-link.active') || navLinksList[0];
}

navLinksList.forEach(link=>{
  link.addEventListener('mouseenter', ()=> moveIndicatorTo(link));
});
navLinksWrap.addEventListener('mouseleave', ()=> moveIndicatorTo(currentActiveLink()));

function onScroll(){
  navbar.classList.toggle('scrolled', window.scrollY > 30);

  const toTop = document.getElementById('toTop');
  toTop.classList.toggle('show', window.scrollY > 500);

  let current = '';
  document.querySelectorAll('section[id]').forEach(sec=>{
    const rect = sec.getBoundingClientRect();
    if(rect.top <= 120 && rect.bottom >= 120) current = sec.id;
  });
  let activeLink = null;
  navLinksList.forEach(link=>{
    const isActive = link.getAttribute('href') === '#' + current;
    link.classList.toggle('active', isActive);
    if(isActive) activeLink = link;
  });
  if(activeLink) moveIndicatorTo(activeLink);
}
window.addEventListener('scroll', onScroll);
window.addEventListener('resize', ()=> moveIndicatorTo(currentActiveLink()));
onScroll();
window.addEventListener('load', ()=> moveIndicatorTo(currentActiveLink()));

/* Mobile menu */
const hamburger = document.getElementById('hamburger');
hamburger.addEventListener('click', ()=>{
  const isOpen = navLinksWrap.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});
navLinksWrap.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=>{
    navLinksWrap.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
  });
});

/* Portfolio category tabs */
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.panel');
tabs.forEach(tab=>{
  tab.addEventListener('click', ()=>{
    tabs.forEach(t=>{ t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
    panels.forEach(p=>p.classList.remove('active'));

    tab.classList.add('active');
    tab.setAttribute('aria-selected','true');
    const activePanel = document.getElementById(tab.dataset.target);
    activePanel.classList.add('active');

    // carousels inside a panel that was just display:none have 0-width
    // measurements; re-trigger their scroll listener now that they're visible
    activePanel.querySelectorAll('[data-track]').forEach(t=> t.dispatchEvent(new Event('scroll')));
  });
});

/* Scroll reveal animation */
const revealEls = document.querySelectorAll('[data-reveal]');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el=>revealObserver.observe(el));

/* Fan-style sub-category carousels (mountain layout: centre card stands tallest) */
function initFanCarousels(){
  document.querySelectorAll('.fan-stage').forEach(stage=>{
    if(stage.dataset.bound) return;
    stage.dataset.bound = 'true';

    const track = stage.querySelector('[data-track]');
    const cards = Array.from(track.children);
    const prevBtn = stage.querySelector('.fan-prev');
    const nextBtn = stage.querySelector('.fan-next');

    function updateFan(){
      const trackRect = track.getBoundingClientRect();
      if(trackRect.width === 0) return; // panel not visible yet
      const centerX = trackRect.left + trackRect.width / 2;
      const half = trackRect.width / 2.6 || 1;
      let closest = null, closestDist = Infinity;

      cards.forEach(card=>{
        const r = card.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - centerX);
        const normalized = Math.min(dist / half, 1);
        card.style.setProperty('--d', normalized.toFixed(3));
        if(dist < closestDist){ closestDist = dist; closest = card; }
      });
      cards.forEach(c=> c.classList.toggle('is-active', c === closest));

      const maxScroll = track.scrollWidth - track.clientWidth;
      prevBtn.disabled = track.scrollLeft <= 4;
      nextBtn.disabled = track.scrollLeft >= maxScroll - 4;
    }

    function step(){
      return ((cards[0]?.getBoundingClientRect().width) || 170) * 2 + 32;
    }
    prevBtn.addEventListener('click', ()=> track.scrollBy({ left: -step(), behavior:'smooth' }));
    nextBtn.addEventListener('click', ()=> track.scrollBy({ left: step(), behavior:'smooth' }));

    let ticking = false;
    track.addEventListener('scroll', ()=>{
      if(!ticking){ ticking = true; requestAnimationFrame(()=>{ updateFan(); ticking = false; }); }
    }, { passive:true });
    window.addEventListener('resize', updateFan);
    updateFan();
  });
}
initFanCarousels();

/* Lightbox for gallery images */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

function bindGalleryClicks(){
  document.querySelectorAll('.fan-card img').forEach(img=>{
    img.addEventListener('click', ()=>{
      lightboxImg.src = img.dataset.full || img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
}
bindGalleryClicks();

function closeLightbox(){
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e)=>{ if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e)=>{ if(e.key === 'Escape') closeLightbox(); });

/* Back to top */
document.getElementById('toTop').addEventListener('click', ()=>{
  window.scrollTo({ top:0, behavior:'smooth' });
});

/* Abstract brass shapes — scroll parallax drift */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion){
  const parallaxEls = Array.from(document.querySelectorAll('[data-parallax]'));
  let ticking = false;
  function applyParallax(){
    const scrollY = window.scrollY;
    parallaxEls.forEach(el=>{
      const factor = parseFloat(el.dataset.parallax) || 0;
      el.style.transform = `translateY(${scrollY * factor}px)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', ()=>{
    if(!ticking){ requestAnimationFrame(applyParallax); ticking = true; }
  }, { passive:true });
  applyParallax();
}


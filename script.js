// script.js
// ============================================
// INSPECTOR — Single-page documentation site
// ============================================

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;

// ============================================
// LENIS SMOOTH SCROLL
// ============================================
let lenis = null;
if (!reducedMotion) {
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
  lenis.on('scroll', ScrollTrigger.update);
}

// ============================================
// PRELOADER BOOT SEQUENCE
// ============================================
const preloader = document.getElementById('preloader');
const preBar = document.getElementById('pre-bar');
const prePercent = document.getElementById('pre-percent');
const preLog = document.getElementById('pre-log');

const BOOT_LOGS = [
  "INITIALIZING SYSTEM",
  "PARSING CLI ARGUMENTS",
  "LOADING MODULES",
  "GATHERING SYSTEM INFO",
  "VERIFYING SANDBOX ROOT",
  "CHECKING SAFE_ENV_KEYS",
  "READY."
];

// Lock scroll during preload
if (lenis) lenis.stop();
document.body.style.overflow = 'hidden';

let progress = 0;
let logIndex = 0;

preLog.textContent = BOOT_LOGS[0];

const bootInterval = setInterval(() => {
  progress += Math.random() * 15 + 5;
  if (progress >= 100) {
    progress = 100;
    clearInterval(bootInterval);

    preLog.textContent = BOOT_LOGS[BOOT_LOGS.length - 1];
    prePercent.textContent = "100%";
    preBar.style.width = "100%";

    setTimeout(() => {
      preloader.classList.add('preloader-hidden');

      document.body.style.overflow = '';
      if (lenis) lenis.start();

      ScrollTrigger.refresh();

      setTimeout(() => {
        preloader.style.display = 'none';
      }, 900);
    }, 500);
  } else {
    preBar.style.width = progress + "%";
    prePercent.textContent = Math.floor(progress) + "%";

    const newIndex = Math.min(Math.floor(progress / (100 / (BOOT_LOGS.length - 1))), BOOT_LOGS.length - 2);
    if (newIndex !== logIndex) {
      logIndex = newIndex;
      preLog.textContent = BOOT_LOGS[logIndex];
    }
  }
}, 220);

// ============================================
// CUSTOM CURSOR
// ============================================
if (!isTouch) {
  const cursor = document.getElementById('cursor');
  const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const pos = { x: target.x, y: target.y };
  let hovering = false;

  window.addEventListener('mousemove', (e) => {
    target.x = e.clientX;
    target.y = e.clientY;
  });

  document.addEventListener('mouseover', (e) => {
    const t = e.target;
    hovering = !!(t.closest('a, button, [data-cursor-hover], .flip-card, .arch-card, .feature-card, .stat-item, .doc-row, .ft-row:not(.ft-head), .safety-card'));
  });

  (function loop() {
    pos.x += (target.x - pos.x) * 0.18;
    pos.y += (target.y - pos.y) * 0.18;
    const size = hovering ? 44 : 10;
    cursor.style.transform = `translate(${pos.x - size/2}px, ${pos.y - size/2}px)`;
    cursor.style.width = cursor.style.height = size + 'px';
    cursor.style.opacity = hovering ? 0.55 : 1;
    requestAnimationFrame(loop);
  })();
}

// ============================================
// HERO TITLE — SCRAMBLE DECODE
// ============================================
const TARGET = 'INSPECTOR';
const CHARS = '!<>-_\\/[]{}—=+*^?#________01';
const heroTitle = document.getElementById('hero-title');

function scrambleDecode() {
  if (reducedMotion) { heroTitle.textContent = TARGET; return; }
  let iter = 0;
  const totalFrames = TARGET.length * 8;
  heroTitle.classList.add('is-decoding');
  (function tick() {
    heroTitle.textContent = TARGET.split('').map((ch, i) => {
      if (i < iter / 8) return TARGET[i];
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }).join('');
    iter += 1;
    if (iter >= totalFrames) {
      heroTitle.textContent = TARGET;
      heroTitle.classList.remove('is-decoding');
      return;
    }
    setTimeout(tick, 38);
  })();
}
// Slight delay so the page paints first
setTimeout(scrambleDecode, 400);

// ============================================
// TERMINAL CYCLING — real commands from README
// ============================================
const terminalBody = document.getElementById('terminal-body');
const termCycle = document.getElementById('term-cycle');

const TERMINAL_SEQUENCES = [
  {
    label: '01/04',
    lines: [
      { type: 'cmd', text: 'npm start' },
      { type: 'out-head', text: '' },
      { type: 'out-head', text: '  ╔════════════════════════════════════╗' },
      { type: 'out-cyan', text: '  ║          INSPECTOR  v1.0           ║' },
      { type: 'out-head', text: '  ╠════════════════════════════════════╣' },
      { type: 'out', text: '  ║  ▶ OS Information                  ║' },
      { type: 'out', text: '  ║    CPU Profile                     ║' },
      { type: 'out', text: '  ║    Memory & Storage                ║' },
      { type: 'out', text: '  ║    Power & Network                 ║' },
      { type: 'out', text: '  ║    File Manager                    ║' },
      { type: 'out', text: '  ║    Export Reports                  ║' },
      { type: 'out-head', text: '  ╚════════════════════════════════════╝' },
      { type: 'out-dim', text: '  ↑↓ navigate · ⏎ select · ^C exit' },
    ]
  },
  {
    label: '02/04',
    lines: [
      { type: 'cmd', text: 'npm run info' },
      { type: 'out-head', text: '' },
      { type: 'out-cyan', text: '  ┌── SYSTEM INFORMATION ──────────────┐' },
      { type: 'out', text: '  │ OS          : darwin 23.1.0' },
      { type: 'out', text: '  │ Arch        : arm64' },
      { type: 'out', text: '  │ Host        : Mac14,2' },
      { type: 'out', text: '  │ Uptime      : 4d 12h 38m' },
      { type: 'out-cyan', text: '  ├── CPU ─────────────────────────────┤' },
      { type: 'out', text: '  │ Model       : Apple M2 Pro' },
      { type: 'out', text: '  │ Cores       : 10 physical / 10 logical' },
      { type: 'out', text: '  │ Speed       : 3504 MHz' },
      { type: 'out', text: '  │ Load Avg    : 1.24 / 1.18 / 1.09' },
      { type: 'out-green', text: '  ✓ Reports exported to ./os-info/' },
    ]
  },
  {
    label: '03/04',
    lines: [
      { type: 'cmd', text: 'npm run info:json' },
      { type: 'out-head', text: '' },
      { type: 'out-cyan', text: '  {' },
      { type: 'out', text: '    "os": {' },
      { type: 'out', text: '      "type": "Darwin",' },
      { type: 'out', text: '      "release": "23.1.0",' },
      { type: 'out', text: '      "arch": "arm64",' },
      { type: 'out', text: '      "uptime": 388080' },
      { type: 'out', text: '    },' },
      { type: 'out', text: '    "cpu": {' },
      { type: 'out', text: '      "model": "Apple M2 Pro",' },
      { type: 'out', text: '      "cores": 10' },
      { type: 'out', text: '    },' },
      { type: 'out-dim', text: '    "env": { /* redacted */ }' },
      { type: 'out-cyan', text: '  }' },
      { type: 'out-green', text: '  ✓ JSON written to ./os-info/os-info.json' },
    ]
  },
  {
    label: '04/04',
    lines: [
      { type: 'cmd', text: 'node sysinspector/src/index.js --dir /path/to/custom/sandbox' },
      { type: 'out-head', text: '' },
      { type: 'out-cyan', text: '  ┌── SANDBOX OVERRIDE ────────────────┐' },
      { type: 'out', text: '  │ Sandbox root: /path/to/custom/sandbox' },
      { type: 'out', text: '  │ Mode        : interactive menu' },
      { type: 'out-cyan', text: '  ╞════════════════════════════════════╡' },
      { type: 'out-dim', text: '  │ _resolveSafe() active' },
      { type: 'out-dim', text: '  │ Path traversal shield: ON' },
      { type: 'out-dim', text: '  │ Confirm gating: ON' },
      { type: 'out-dim', text: '  │ Env redaction: SAFE_ENV_KEYS + looksSecret()' },
      { type: 'out-cyan', text: '  └────────────────────────────────────┘' },
      { type: 'out-green', text: '  ✓ Ready. Press ↑↓ to navigate.' },
    ]
  },
];

let currentSeq = 0;
let typingTimeout = null;

function typeLine(line, idx, totalLines, onDone) {
  const span = document.createElement('span');
  span.className = 'term-line';
  
  if (line.type === 'cmd') {
    span.innerHTML = '<span class="prompt">$</span><span class="term-cmd"></span>';
    const cmdSpan = span.querySelector('.term-cmd');
    if (reducedMotion) {
      cmdSpan.textContent = line.text;
      terminalBody.appendChild(span);
      onDone();
      return;
    }
    // Type the command char by char
    let i = 0;
    (function typeChar() {
      if (i <= line.text.length) {
        cmdSpan.textContent = line.text.slice(0, i);
        i++;
        typingTimeout = setTimeout(typeChar, 28);
      } else {
        onDone();
      }
    })();
  } else {
    span.classList.add(
      line.type === 'out' ? 'term-out' :
      line.type === 'out-dim' ? 'term-out-dim' :
      line.type === 'out-green' ? 'term-out-green' :
      line.type === 'out-cyan' ? 'term-out-cyan' :
      line.type === 'out-head' ? 'term-out-head' : 'term-out'
    );
    span.textContent = line.text || '\u00A0';
    terminalBody.appendChild(span);
    onDone();
  }
}

function playSequence(seqIdx) {
  clearTimeout(typingTimeout);
  terminalBody.innerHTML = '';
  const seq = TERMINAL_SEQUENCES[seqIdx];
  termCycle.textContent = seq.label;
  
  let lineIdx = 0;
  function nextLine() {
    if (lineIdx >= seq.lines.length) {
      // Wait, then advance
      typingTimeout = setTimeout(() => {
        currentSeq = (currentSeq + 1) % TERMINAL_SEQUENCES.length;
        playSequence(currentSeq);
      }, 3200);
      return;
    }
    const line = seq.lines[lineIdx];
    typeLine(line, lineIdx, seq.lines.length, () => {
      lineIdx++;
      typingTimeout = setTimeout(nextLine, line.type === 'cmd' ? 280 : 90);
    });
  }
  nextLine();
}

// Start the terminal cycling
setTimeout(() => playSequence(0), 1200);

// ============================================
// MANIFESTO — SCRUB BLUR WORDS
// ============================================
document.fonts.ready.then(() => {
  const manifestoEl = document.getElementById('manifesto-text');
  const raw = manifestoEl.textContent.trim();
  const words = raw.split(/\s+/);
  manifestoEl.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');
  
  if (reducedMotion) {
    document.querySelectorAll('.manifesto .word').forEach(w => {
      w.style.opacity = 1;
      w.style.filter = 'none';
    });
    return;
  }
  
  gsap.to('.manifesto .word', {
    opacity: 1,
    filter: 'blur(0px) brightness(100%)',
    stagger: 0.04,
    ease: 'sine.out',
    scrollTrigger: {
      trigger: '#manifesto-container',
      start: 'top 78%',
      end: 'center 55%',
      scrub: true,
    }
  });
});

// ============================================
// COUNTERS — animated on scroll into view
// ============================================
document.querySelectorAll('.counter').forEach(el => {
  const target = parseInt(el.dataset.target, 10);
  if (reducedMotion) {
    el.textContent = target;
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.floor(obj.val); }
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
  observer.observe(el);
});

// ============================================
// INTERSECTION OBSERVER — generic reveals
// ============================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -80px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Timeline nodes — staggered reveal
document.querySelectorAll('.timeline-block').forEach(block => {
  const nodes = block.querySelectorAll('.tl-node');
  nodes.forEach((node, i) => {
    setTimeout(() => {
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('is-in'), i * 120);
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4, rootMargin: '0px 0px -40px 0px' });
      obs.observe(node);
    });
  });
});

// ============================================
// ARCHITECTURE — DRAG CAROUSEL
// ============================================
const carousel = document.getElementById('arch-carousel');
if (carousel) {
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('dragging');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('dragging');
  });
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.8;
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Touch support — native scroll handles most, but add momentum feel
  let touchStartX = 0;
  let touchScrollLeft = 0;
  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
  }, { passive: true });
  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.5;
    carousel.scrollLeft = touchScrollLeft - walk;
  }, { passive: true });
}

// ============================================
// STREAMS & MEDIA GALLERY
// ============================================
const MEDIA_LIBRARY = [
  { 
    type: 'video', 
    thumb: 'https://pub-70dd9905db20488e9d6526ca510e0d40.r2.dev/interactive%20cli%20menu%20wolkthrough.mp4', 
    src: 'https://pub-70dd9905db20488e9d6526ca510e0d40.r2.dev/interactive%20cli%20menu%20wolkthrough.mp4', 
    title: 'Interactive CLI Menu Walkthrough', 
    size: 'big' 
  },
  { 
    type: 'image', 
    thumb: 'media/images/detailed_os_info.png', 
    src: 'media/images/detailed_os_info.png',
    title: 'Detailed OS Information Output', 
    size: 'tall' 
  },
  { 
    type: 'image', 
    thumb: 'media/images/main_os_info.png', 
    src: 'media/images/main_os_info.png',
    title: 'Main OS Info Dashboard', 
    size: 'wide' 
  },
  { 
    type: 'image', 
    thumb: 'media/images/crud_terminal.png', 
    src: 'media/images/crud_terminal.png',
    title: 'File Manager CRUD Operations', 
    size: 'small' 
  },
  { 
    type: 'image', 
    thumb: 'media/images/file_browse.png', 
    src: 'media/images/file_browse.png',
    title: 'File Browser Interface', 
    size: 'small' 
  },
  { 
    type: 'video', 
    thumb: 'https://pub-70dd9905db20488e9d6526ca510e0d40.r2.dev/Explanationvideo_web.mp4', 
    src: 'https://pub-70dd9905db20488e9d6526ca510e0d40.r2.dev/Explanationvideo_web.mp4',
    title: 'Inspector Explanation Walkthrough', 
    size: 'wide' 
  },
];

const galleryGrid = document.getElementById('gallery-grid');
const lightbox = document.getElementById('lightbox');
const lbContent = document.getElementById('lb-content');
const lbCaption = document.getElementById('lb-caption');
const lbClose = document.getElementById('lb-close');

function renderGallery() {
  if (!galleryGrid) return;
  galleryGrid.innerHTML = '';

  MEDIA_LIBRARY.forEach((item, index) => {
    const mediaEl = document.createElement('div');
    mediaEl.className = `media-item ${item.size || 'small'}`;
    mediaEl.dataset.index = index;

    // 1. Thumbnail (Native lazy load)
    const thumb = document.createElement('img');
    thumb.className = 'media-thumb';
    thumb.src = item.thumb;
    thumb.alt = item.title;
    thumb.loading = 'lazy'; 
    mediaEl.appendChild(thumb);

    // 2. Meta Info
    const meta = document.createElement('div');
    meta.className = 'media-meta';
    meta.innerHTML = `
      <span class="media-type-tag">${item.type.toUpperCase()}</span>
      <div class="media-title">${item.title}</div>
    `;
    mediaEl.appendChild(meta);

    // 3. Play Button overlay for Videos
    if (item.type === 'video') {
      const playBtn = document.createElement('div');
      playBtn.className = 'play-overlay';
      mediaEl.appendChild(playBtn);
    }

    // 4. Click event to open Lightbox
    mediaEl.addEventListener('click', () => openLightbox(item));
    galleryGrid.appendChild(mediaEl);
  });
}

function openLightbox(item) {
  lbContent.innerHTML = '';
  
  if (item.type === 'image') {
    // Standard image load
    const fullImg = document.createElement('img');
    fullImg.src = item.src;
    fullImg.alt = item.title;
    lbContent.appendChild(fullImg);
    
  } else if (item.type === 'video') {
    // YouTube-style lazy load: Only inject the video element when clicked.
    // preload="metadata" ensures it only downloads the header info first, 
    // then streams the rest when playing.
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'metadata'; 
    
    const source = document.createElement('source');
    source.src = item.src;
    source.type = 'video/mp4'; // Ensure your videos are MP4 for maximum compatibility
    video.appendChild(source);
    
    lbContent.appendChild(video);
    video.load(); // Initiate metadata load
  }

  lbCaption.textContent = item.title;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden'; 
  if (lenis) lenis.stop();
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lbContent.innerHTML = ''; // Crucial: pauses and removes the video element entirely
  document.body.style.overflow = '';
  if (lenis) lenis.start();
}

lbClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('active')) {
    closeLightbox();
  }
});

// Initialize the gallery
renderGallery();

// ============================================
// FLIP CARDS — keyboard accessible
// ============================================
document.querySelectorAll('.flip-card').forEach(card => {
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      card.classList.toggle('is-flipped');
    }
  });
  // Tap to flip toggle
  card.addEventListener('click', () => {
    card.classList.toggle('is-flipped');
  });
});

// ============================================
// MOBILE NAVIGATION & SCROLLSPY
// ============================================
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');
const navOverlay = document.getElementById('nav-overlay');

function closeNav() {
  navToggle?.classList.remove('nav-toggle-active');
  navLinks?.classList.remove('nav-active');
  navOverlay?.classList.remove('active');
}

navToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('nav-active');
  navToggle.classList.toggle('nav-toggle-active', isOpen);
  navOverlay?.classList.toggle('active', isOpen);
});

navOverlay?.addEventListener('click', closeNav);
navLinks?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeNav);
});

// Active link highlight on scroll using IntersectionObserver
const navSections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      active?.classList.add('active');
    }
  });
}, { threshold: 0.4 });

navSections.forEach(s => navObserver.observe(s));

// Smooth scroll for nav links via Lenis
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, duration: 1.2 });
    } else {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================
// MARQUEE PAUSE ON HOVER
// ============================================
const marqueeTrack = document.querySelector('.marquee-track');
const marqueeSection = document.querySelector('.marquee-section');
if (marqueeTrack && marqueeSection) {
  marqueeSection.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeSection.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ============================================
// HIDE BOTTOM CTA WHEN FOOTER IN VIEW
// ============================================
const bottomCTA = document.querySelector('.bottom-cta');
const footerEl = document.getElementById('footer');
if (bottomCTA && footerEl) {
  const footerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        bottomCTA.style.opacity = '0';
        bottomCTA.style.pointerEvents = 'none';
        bottomCTA.style.transform = 'translateX(-50%) translateY(20px)';
      } else {
        bottomCTA.style.opacity = '1';
        bottomCTA.style.pointerEvents = 'auto';
        bottomCTA.style.transform = 'translateX(-50%) translateY(0)';
      }
    });
  }, { rootMargin: '0px 0px -60% 0px' });
  footerObs.observe(footerEl);
  bottomCTA.style.transition = 'opacity .4s var(--ease-quiet), transform .4s var(--ease-quiet)';
}

// ============================================
// ARCH CARDS — DIRECTIONAL CLIP REVEAL
// ============================================
if (!reducedMotion) {
  const archCards = document.querySelectorAll('.arch-card');
  archCards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px) rotate(' + (i % 2 === 0 ? '-' : '') + '2deg)';
  });
  
  const archObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        archCards.forEach((card, i) => {
          setTimeout(() => {
            card.style.transition = 'opacity .8s var(--ease-quiet), transform .8s var(--ease-quiet), border-color .4s var(--ease-quiet)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) rotate(0)';
          }, i * 100);
        });
        archObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  const archCarousel = document.getElementById('arch-carousel');
  if (archCarousel) {
    archObs.observe(archCarousel);
  }
}

// ============================================
// FEATURES — DIRECTIONAL CLIP REVEAL
// ============================================
if (!reducedMotion) {
  const featureCards = document.querySelectorAll('.feature-card');
  const dirs = [
    'inset(0 100% 0 0)',
    'inset(0 0 100% 0)',
    'inset(0 0 0 100%)',
    'inset(100% 0 0 0)',
  ];
  featureCards.forEach((card, i) => {
    gsap.set(card, { clipPath: dirs[i % dirs.length], opacity: 1 });
  });
  
  ScrollTrigger.create({
    trigger: '.features-grid',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      featureCards.forEach((card, i) => {
        gsap.to(card, {
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: 1.1,
          ease: 'power4.inOut',
          delay: i * 0.12,
        });
      });
    }
  });
}

// ============================================
// REFRESH SCROLLTRIGGER AFTER FONTS LOAD
// ============================================
document.fonts.ready.then(() => {
  ScrollTrigger.refresh();
});

// ============================================
// KEEP NAV ACTIVE STATE CORRECT ON RESIZE
// ============================================
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
});

// ============================================
// ISSUE SOLVER NAV — ACTIVE HIGHLIGHT ON SCROLL
// ============================================
const issueCats = document.querySelectorAll('.issue-category');
const issueLinks = document.querySelectorAll('.issue-nav-link');

if (issueCats.length > 0) {
  const issueObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        issueLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-30% 0px -60% 0px' });

  issueCats.forEach(cat => issueObs.observe(cat));
}

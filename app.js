/**
 * NaFraBace Interstellar - Canvas Scroll Engine & UI Interactions
 * Senior Frontend Architecture Edition
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config & Constants
  const TOTAL_FRAMES = 217;
  const SECTION_MAP = [
    { id: 'hero', min: 0, max: 27 },
    { id: 'destinos', min: 28, max: 62 },
    { id: 'flota', min: 63, max: 97 },
    { id: 'academia', min: 98, max: 132 },
    { id: 'soporte', min: 133, max: 167 },
    { id: 'testimonios', min: 168, max: 202 },
    { id: 'reserva', min: 203, max: 215 },
    { id: 'site-footer', min: 216, max: 216 }
  ];

  const canvas = document.getElementById('space-canvas');
  const ctx = canvas.getContext('2d');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');
  const preloader = document.getElementById('preloader');

  let images = [];
  let imagesLoadedCount = 0;
  let currentFrameIndex = 0;
  let targetFrameIndex = 0;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Generate Frame URLs according to public asset directory structure
  function getFrameUrl(index) {
    if (index === 217) {
      return 'assets/space-scroll/footer_nafrabace.png';
    }
    const padded = String(index).padStart(3, '0');
    return `assets/space-scroll/ezgif-frame-${padded}.png`;
  }

  // Handle Window Resize to keep Canvas full screen & high DPI
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    renderFrame(currentFrameIndex);
  }

  window.addEventListener('resize', resizeCanvas);

  // Preload Images
  function preloadImages() {
    return new Promise((resolve) => {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const img = new Image();
        img.src = getFrameUrl(i);
        img.onload = () => {
          imagesLoadedCount++;
          const percent = Math.round((imagesLoadedCount / TOTAL_FRAMES) * 100);
          if (loaderBar) loaderBar.style.width = `${percent}%`;
          if (loaderStatus) loaderStatus.textContent = `Sincronizando fotogramas orbitales... ${percent}%`;

          if (imagesLoadedCount === TOTAL_FRAMES) {
            resolve();
          }
        };
        img.onerror = () => {
          imagesLoadedCount++;
          if (imagesLoadedCount === TOTAL_FRAMES) resolve();
        };
        images.push(img);
      }
    });
  }

  // Draw frame on canvas with CSS 'cover' aspect ratio algorithm & ultra-smooth transition for last frame
  function renderFrame(exactFrameIndex) {
    const baseIndex = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.floor(exactFrameIndex)));
    const nextIndex = Math.min(TOTAL_FRAMES - 1, baseIndex + 1);
    const progressBetween = exactFrameIndex - baseIndex;

    const imgBase = images[baseIndex];
    if (!imgBase || !imgBase.complete || imgBase.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = imgBase.naturalWidth;
    const imgHeight = imgBase.naturalHeight;

    const imgRatio = imgWidth / imgHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvasWidth;
      drawHeight = canvasWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    } else {
      drawWidth = canvasHeight * imgRatio;
      drawHeight = canvasHeight;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // If approaching final frame (216 -> 217), apply a silky smooth cross-fade blend
    if (baseIndex >= TOTAL_FRAMES - 2 && nextIndex === TOTAL_FRAMES - 1 && progressBetween > 0) {
      const imgNext = images[nextIndex];
      ctx.globalAlpha = 1 - progressBetween;
      ctx.drawImage(imgBase, offsetX, offsetY, drawWidth, drawHeight);

      if (imgNext && imgNext.complete && imgNext.naturalWidth > 0) {
        ctx.globalAlpha = progressBetween;
        ctx.drawImage(imgNext, offsetX, offsetY, drawWidth, drawHeight);
      }
      ctx.globalAlpha = 1.0;
    } else {
      ctx.globalAlpha = 1.0;
      ctx.drawImage(imgBase, offsetX, offsetY, drawWidth, drawHeight);
    }

    // Sync section visibility with active frames using fixed timeline ranges
    const roundedIndex = Math.round(exactFrameIndex);
    let activeId = 'hero';
    
    SECTION_MAP.forEach((item) => {
      const sec = document.getElementById(item.id);
      if (sec) {
        if (roundedIndex >= item.min && roundedIndex <= item.max) {
          sec.classList.add('active');
          activeId = item.id;
        } else {
          sec.classList.remove('active');
        }
      }
    });

    // Highlight navbar links dynamically
    const allNavLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    allNavLinks.forEach((link) => {
      if (link.getAttribute('href') === `#${activeId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // Smooth Interpolated Render Loop (60 FPS LERP)
  function renderLoop() {
    if (isReducedMotion) {
      currentFrameIndex = targetFrameIndex;
    } else {
      // Linear Interpolation for fluid motion
      const diff = targetFrameIndex - currentFrameIndex;
      currentFrameIndex += diff * 0.14;

      if (Math.abs(diff) < 0.005) {
        currentFrameIndex = targetFrameIndex;
      }
    }

    renderFrame(currentFrameIndex);
    requestAnimationFrame(renderLoop);
  }

  // Calculate target frame index based on page scroll position
  function updateScrollTarget() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (maxScroll <= 0) return;

    const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
    // Maps smoothly to 0 ... (TOTAL_FRAMES - 1)
    targetFrameIndex = scrollFraction * (TOTAL_FRAMES - 1);
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });

  // REVEAL ON SCROLL ENGINE (Senior High-Performance Edition)
  const revealElements = document.querySelectorAll('.reveal');

  function triggerRevealIfVisible() {
    const triggerBottom = window.innerHeight * 0.92;
    revealElements.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('active');
      }
    });
  }

  // IntersectionObserver for GPU-accelerated reveal
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      },
      {
        root: null,
        threshold: 0.02,
        rootMargin: '100px 0px 50px 0px'
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  }

  // Handle click on all page anchor links to scroll to specific frame ranges
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').substring(1);
      if (!targetId) return;

      const targetItem = SECTION_MAP.find(item => item.id === targetId);
      if (targetItem) {
        e.preventDefault();
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        // Scroll to the start of the frame range (or slightly in)
        const targetFrame = targetItem.min;
        const targetScroll = (targetFrame / (TOTAL_FRAMES - 1)) * maxScroll;
        
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });

        // Close mobile drawer if open
        if (typeof closeMobileMenu === 'function') {
          closeMobileMenu();
        }
      }
    });
  });

  // Mobile Menu Drawer Interactions
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  function openMobileMenu() {
    if (!mobileMenu || !hamburgerBtn) return;
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-active');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.classList.add('menu-open');
  }

  function closeMobileMenu() {
    if (!mobileMenu || !hamburgerBtn) return;
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-active');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
      const isOpen = mobileMenu && mobileMenu.classList.contains('is-active');
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenu) {
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  mobileNavLinks.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('is-active')) {
      closeMobileMenu();
    }
  });

  // Booking Calculator (Section 7)
  const destSelect = document.getElementById('destination');
  const classSelect = document.getElementById('travel-class');
  const passInput = document.getElementById('passengers');
  const totalDisplay = document.getElementById('total-price');
  const bookingForm = document.getElementById('booking-form');

  function calculateTotal() {
    if (!destSelect || !classSelect || !passInput || !totalDisplay) return;
    const basePrice = parseFloat(destSelect.value) || 0;
    const classMultiplier = parseFloat(classSelect.value) || 1;
    const passCount = parseInt(passInput.value) || 1;

    const total = basePrice * classMultiplier * passCount;
    totalDisplay.textContent = `${total.toLocaleString('es-ES')} CR`;
  }

  if (destSelect && classSelect && passInput) {
    destSelect.addEventListener('change', calculateTotal);
    classSelect.addEventListener('change', calculateTotal);
    passInput.addEventListener('input', calculateTotal);
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('¡TICKET ESTELAR CONFIRMADO! Se ha enviado tu código de emisión Q-77 al canal Comms.');
    });
  }

  // Live Telemetry Log Simulation (Section 5)
  const telemetryLog = document.getElementById('live-telemetry-log');
  const shieldVal = document.getElementById('shield-val');

  if (telemetryLog) {
    const logs = [
      "SAT-LINK: Recibida señal de baliza en sub-espacio...",
      "GRAV-NAV: Ajuste micro-vectorial completado (0.002°)",
      "SYS-LIFE: Nivel de CO2 reciclado al 99.94%",
      "PROPULSION: Temperatura de núcleo inerte a 4,200K",
      "ORBIT-CHECK: Trayectoria sincrónica verificada"
    ];
    let logIdx = 0;

    setInterval(() => {
      logIdx = (logIdx + 1) % logs.length;
      const now = new Date().toISOString().substring(11, 19);
      telemetryLog.innerHTML = `<span class="terminal-prefix">[${now}]</span> <span>${logs[logIdx]}</span>`;
      
      if (shieldVal) {
        const shield = (99.7 + Math.random() * 0.25).toFixed(2);
        shieldVal.textContent = `${shield}% OPTIMAL`;
      }
    }, 3500);
  }

  // Set default launch date in form
  const launchDateInput = document.getElementById('launch-date');
  if (launchDateInput) {
    const today = new Date();
    today.setDate(today.getDate() + 30);
    launchDateInput.value = today.toISOString().split('T')[0];
  }

  // Initialize Canvas & Start
  resizeCanvas();
  preloadImages().then(() => {
    if (preloader) {
      preloader.classList.add('loaded');
    }
    updateScrollTarget();
    triggerRevealIfVisible();
    requestAnimationFrame(renderLoop);
  });
});

/**
 * NaFraBace Interstellar - Canvas Scroll Engine & UI Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // Config & Constants
  const TOTAL_FRAMES = 217;
  const canvas = document.getElementById('space-canvas');
  const ctx = canvas.getContext('2d');
  const loaderBar = document.getElementById('loader-bar');
  const loaderStatus = document.getElementById('loader-status');
  const preloader = document.getElementById('preloader');
  const motionToggleBtn = document.getElementById('motion-toggle');
  const motionLabel = document.getElementById('motion-label');

  let images = [];
  let imagesLoadedCount = 0;
  let currentFrameIndex = 0;
  let targetFrameIndex = 0;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isAnimationRunning = true;

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
    renderFrame(Math.round(currentFrameIndex));
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
          // If individual image load fails, count anyway to avoid hanging
          imagesLoadedCount++;
          if (imagesLoadedCount === TOTAL_FRAMES) resolve();
        };
        images.push(img);
      }
    });
  }

  // Draw frame on canvas with CSS 'cover' aspect ratio algorithm
  function renderFrame(frameIdx) {
    const img = images[frameIdx];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;

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
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }

  // Smooth Interpolated Render Loop (60 FPS LERP)
  function renderLoop() {
    if (isReducedMotion) {
      currentFrameIndex = targetFrameIndex;
    } else {
      // Linear Interpolation for fluid motion
      const diff = targetFrameIndex - currentFrameIndex;
      currentFrameIndex += diff * 0.12;

      // Snap to target if extremely close
      if (Math.abs(diff) < 0.01) {
        currentFrameIndex = targetFrameIndex;
      }
    }

    renderFrame(Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameIndex))));
    requestAnimationFrame(renderLoop);
  }

  // Calculate target frame index based on page scroll position
  function updateScrollTarget() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    
    if (maxScroll <= 0) return;

    const scrollFraction = Math.min(1, Math.max(0, scrollTop / maxScroll));
    targetFrameIndex = Math.floor(scrollFraction * (TOTAL_FRAMES - 1));
  }

  window.addEventListener('scroll', updateScrollTarget, { passive: true });

  // Motion Toggle Button setup
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener('click', () => {
      isReducedMotion = !isReducedMotion;
      motionLabel.textContent = isReducedMotion ? 'FX STÁTICO' : 'FX 60FPS';
      motionToggleBtn.style.borderColor = isReducedMotion ? '#ffb703' : 'var(--glass-border)';
    });
  }

  // Active Navbar link on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNavOnScroll() {
    let scrollPos = window.scrollY + 200;
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
        const id = section.getAttribute('id');
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNavOnScroll, { passive: true });

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
    // Hide preloader
    if (preloader) {
      preloader.classList.add('loaded');
    }
    updateScrollTarget();
    requestAnimationFrame(renderLoop);
  });
});

let current = 0;
let gallery = [];
let isAnimating = false;

/* ===================================== */
/* INIT */
/* ===================================== */

function initGallery(data) {
  if (!Array.isArray(data) || data.length === 0) return;

  gallery = data;
  current = 0;

  render();
  preload();

  initKeyboard();
  initSwipe();
  initSilentMode();
  initTapNavigation();
}

/* ===================================== */
/* PRELOAD */
/* ===================================== */

function preload() {
  if (gallery.length < 2) return;

  const next = (current + 1) % gallery.length;

  [current, next].forEach(i => {
    const img = new Image();
    img.src = gallery[i].src;
  });
}

/* ===================================== */
/* RENDER (CLEAN FORMAT LAYER) */
/* ===================================== */

function render() {
  const img = document.getElementById("artwork");
  const caption = document.getElementById("caption");

  if (!img || !caption || !gallery[current]) return;

  const item = gallery[current];

  caption.style.opacity = "0";

  img.src = item.src;

  // единый формат строки (будет расширяться)
  caption.textContent = "";

  const line = [
    item.title,
    item.meta
  ].filter(Boolean).join(" · ");

  caption.innerHTML = line;

  requestAnimationFrame(() => {
    caption.style.opacity = "1";
  });

  preload();
}

/* ===================================== */
/* NAVIGATION */
/* ===================================== */

function nextImage() {
  if (isAnimating || gallery.length < 2) return;

  isAnimating = true;

  const img = document.getElementById("artwork");
  if (img) img.classList.add("fade-out");

  setTimeout(() => {
    current = (current + 1) % gallery.length;
    render();

    requestAnimationFrame(() => {
      if (img) img.classList.remove("fade-out");
      isAnimating = false;
    });
  }, 200);
}

function prevImage() {
  if (isAnimating || gallery.length < 2) return;

  isAnimating = true;

  const img = document.getElementById("artwork");
  if (img) img.classList.add("fade-out");

  setTimeout(() => {
    current = (current - 1 + gallery.length) % gallery.length;
    render();

    requestAnimationFrame(() => {
      if (img) img.classList.remove("fade-out");
      isAnimating = false;
    });
  }, 200);
}

/* ===================================== */
/* KEYBOARD */
/* ===================================== */

function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
}

/* ===================================== */
/* SWIPE (mobile UX) */
/* ===================================== */

function initSwipe() {
  const img = document.getElementById("artwork");
  if (!img) return;

  let startX = 0;

  img.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  img.addEventListener("touchend", (e) => {
    const endX = e.changedTouches[0].clientX;

    if (endX - startX > 50) prevImage();
    if (startX - endX > 50) nextImage();
  });
}

/* ===================================== */
/* TAP NAVIGATION (mobile) */
/* ===================================== */

function initTapNavigation() {
  const img = document.getElementById("artwork");
  if (!img) return;

  const isMobile = window.innerWidth <= 768;

  if (!isMobile) return;

  img.addEventListener("click", () => {
    nextImage();
  });
}

/* ===================================== */
/* SILENT MODE (FIXED SAFE VERSION) */
/* ===================================== */

function initSilentMode() {
  const nav = document.querySelectorAll(".nav");
  const caption = document.querySelector(".viewer-caption");

  let timeout;

  function showUI() {
    nav.forEach(el => {
      if (el) el.style.opacity = "0.5";
    });

    if (caption) caption.style.opacity = "1";

    clearTimeout(timeout);
    timeout = setTimeout(hideUI, 2500);
  }

  function hideUI() {
    nav.forEach(el => {
      if (el) el.style.opacity = "0";
    });

    if (caption) caption.style.opacity = "0.2";
  }

  document.addEventListener("mousemove", showUI);
  document.addEventListener("touchstart", showUI);

  showUI();
}

/* ===================================== */
/* EXPORTS */
/* ===================================== */

window.initGallery = initGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.initSilentMode = initSilentMode;
window.initSwipe = initSwipe;
window.initKeyboard = initKeyboard;
window.initTapNavigation = initTapNavigation;

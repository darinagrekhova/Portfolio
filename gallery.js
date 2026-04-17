let current = 0;
let gallery = [];
let isAnimating = false;
let currentSeriesDescription = "";

/* ===================================== */
/* INIT */
/* ===================================== */

function initGallery(data) {
  if (!data || !data.length) return;

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
  const next = (current + 1) % gallery.length;

  [current, next].forEach(i => {
    const img = new Image();
    img.src = gallery[i].src;
  });
}

/* ===================================== */
/* RENDER */
/* ===================================== */

function render() {
  const img = document.getElementById("artwork");
  const caption = document.getElementById("caption");

  if (!img || !caption) return;

  caption.style.opacity = "0";

  img.src = gallery[current].src;

  caption.innerHTML =
    `<em>${gallery[current].title || ""}</em><br>${gallery[current].meta || ""}`;

  const seriesText = document.getElementById("series-text");
if (seriesText) {
  seriesText.textContent = currentSeriesDescription || "";
  }

  setTimeout(() => {
    caption.style.opacity = "1";
  }, 250);

  preload();
}

/* ===================================== */
/* NAVIGATION */
/* ===================================== */

function nextImage() {
  if (isAnimating || gallery.length < 2) return;
  isAnimating = true;

  const img = document.getElementById("artwork");
  img.classList.add("fade-out");

  setTimeout(() => {
    current = (current + 1) % gallery.length;
    render();

    requestAnimationFrame(() => {
      img.classList.remove("fade-out");
      isAnimating = false;
    });
  }, 200);
}

function prevImage() {
  if (isAnimating || gallery.length < 2) return;
  isAnimating = true;

  const img = document.getElementById("artwork");
  img.classList.add("fade-out");

  

  setTimeout(() => {
    current = (current - 1 + gallery.length) % gallery.length;
    render();

    requestAnimationFrame(() => {
      img.classList.remove("fade-out");
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
/* SWIPE */
/* ===================================== */

function initSwipe() {
  let startX = 0;
  const img = document.getElementById("artwork");
  if (!img) return;

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
/* SILENT MODE (FIXED - NO NAV BREAKING) */
/* ===================================== */

function initSilentMode() {
  const nav = document.querySelectorAll(".nav");
  const caption = document.querySelectorAll(".viewer-caption");

  let timeout;

  function showUI() {
    nav.forEach(el => el.style.opacity = "0.5");
    caption.forEach(el => el.style.opacity = "1");

    clearTimeout(timeout);
    timeout = setTimeout(hideUI, 2500);
  }

  function hideUI() {
    nav.forEach(el => el.style.opacity = "0");
    caption.forEach(el => el.style.opacity = "0.2");
  }

  document.addEventListener("mousemove", showUI);
  document.addEventListener("touchstart", showUI);

  showUI();
}

/* ===================================== */
/* SIDEBAR */
/* ===================================== */

function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  const isRU = window.location.pathname.includes('/ru/');

  // 🔥 КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ:
  const base = window.location.origin;

  const path = isRU
    ? base + '/ru/sidebar.html'
    : base + '/sidebar.html';

  fetch(path)
    .then(res => {
      if (!res.ok) throw new Error("Sidebar fetch failed: " + res.status);
      return res.text();
    })
    .then(html => {
      container.innerHTML = html;

      const file = window.location.pathname.split("/").pop();

      document.querySelectorAll(".menu-item a").forEach(a => {
        if (a.getAttribute("href") === file) {
          a.classList.add("active");
        }
      });
    })
    .catch(err => {
      console.error("Sidebar error:", err);
    });
}

/* ===================================== */
/* EXPORT */
/* ===================================== */

window.initGallery = initGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.loadSidebar = loadSidebar;
window.initSilentMode = initSilentMode;
function initTapNavigation() {
  const img = document.getElementById("artwork");
  if (!img) return;

  img.addEventListener("click", () => {
    nextImage();
  });
}

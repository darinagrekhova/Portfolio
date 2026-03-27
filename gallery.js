let current = 0;
let isAnimating = false;
let gallery = [];
let uiTimeout;

/* ===== INIT ===== */
function initGallery(data) {
  if (!data || !data.length) return;

  gallery = data;
  current = 0;

  render();
  preloadSmart();

  initKeyboard();
  initSwipe();
  initSilentMode();
}

/* ===== SMART PRELOAD ===== */
function preloadSmart() {
  if (!gallery.length) return;

  const next = (current + 1) % gallery.length;

  [current, next].forEach(i => {
    const img = new Image();
    img.src = gallery[i].src;
  });
}

/* ===== RENDER ===== */
function render() {
  if (!gallery.length) return;

  const img = document.getElementById("artwork");
  const caption = document.getElementById("caption");

  if (!img || !caption) return;

  caption.style.opacity = "0";

  img.src = gallery[current].src;

  caption.innerHTML =
    `<em>${gallery[current].title || ""}</em><br>${gallery[current].meta || ""}`;

  setTimeout(() => {
    caption.style.opacity = "1";
  }, 300);

  preloadSmart();
}

/* ===== NAV ===== */
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
  }, 250);
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
  }, 250);
}

/* ===== ZOOM ===== */
function initZoom() {
  const img = document.getElementById("artwork");
  if (!img) return;

  img.addEventListener("click", (e) => {
    const rect = img.getBoundingClientRect();

    const offsetX = (e.clientX - rect.left) / rect.width;
    const offsetY = (e.clientY - rect.top) / rect.height;

    img.style.setProperty('--zoom-x', `${offsetX * 100}%`);
    img.style.setProperty('--zoom-y', `${offsetY * 100}%`);

    img.classList.toggle("zoomed");
  });
}

/* ===== KEYBOARD ===== */
function initKeyboard() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  });
}

/* ===== SWIPE ===== */
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

/* ===== SILENT MODE ===== */
function initSilentMode() {
  const elements = document.querySelectorAll(".nav, .viewer-caption");

  function showUI() {
    elements.forEach(el => el.style.opacity = "0.5");

    clearTimeout(uiTimeout);
    uiTimeout = setTimeout(hideUI, 2000);
  }

  function hideUI() {
    elements.forEach(el => el.style.opacity = "0");
  }

  document.addEventListener("mousemove", showUI);
  document.addEventListener("touchstart", showUI);

  showUI();
}

/* ===== SIDEBAR ===== */
function loadSidebar() {
  const isRU = window.location.pathname.includes('/ru/');
  const sidebarPath = isRU ? '/ru/sidebar.html' : '/sidebar.html';

  fetch(sidebarPath)
    .then(res => res.text())
    .then(data => {
      document.getElementById('sidebar-container').innerHTML = data;

      const file = window.location.pathname.split("/").pop();

      document.querySelectorAll('.menu-item a').forEach(link => {
        if (link.getAttribute('href').includes(file)) {
          link.classList.add('active');
        }
      });

      updateLanguageLinks();
    })
    .catch(err => console.error("Sidebar load error:", err));
}

/* ===== LANGUAGE SWITCH ===== */
function updateLanguageLinks() {
  const path = window.location.pathname;
  const file = path.split("/").pop();

  const ruLink = document.querySelector('.language-switch a[href*="ru"]');
  const enLink = document.querySelector('.language-switch a[href*="index"], .language-switch a[href*="/"]');

  if (!ruLink || !enLink) return;

  if (path.includes('/ru/')) {
    enLink.href = '/' + file;
    ruLink.href = path;
  } else {
    ruLink.href = '/ru/' + file;
    enLink.href = path;
  }
}

/* ===== SUBMENU ===== */
function toggleSubmenu(id) {
  const submenu = document.getElementById('submenu-' + id);
  if (!submenu) return;

  submenu.style.display =
    submenu.style.display === 'flex' ? 'none' : 'flex';
}

/* ===== EXPORT ===== */
window.initGallery = initGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;
window.initZoom = initZoom;
window.loadSidebar = loadSidebar;

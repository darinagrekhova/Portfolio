let current = 0;
let isAnimating = false;
let gallery = [];
let uiTimeout;

/* ===== INIT ===== */
function initGallery(data) {
  gallery = data;
  preloadSmart();
  render();
}

/* ===== SMART PRELOAD ===== */
function preloadSmart() {
  const next = (current + 1) % gallery.length;

  [current, next].forEach(i => {
    const img = new Image();
    img.src = gallery[i].src;
  });
}

/* ===== RENDER ===== */
function render() {
  const img = document.getElementById("artwork");
  const caption = document.getElementById("caption");

  caption.style.opacity = "0";

  img.src = gallery[current].src;
  caption.innerHTML =
    `<em>${gallery[current].title}</em><br>${gallery[current].meta}`;

  setTimeout(() => {
    caption.style.opacity = "1";
  }, 500);

  preloadSmart();
}

/* ===== NAV ===== */
function nextImage() {
  if (isAnimating) return;
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

  }, 300);
}

function prevImage() {
  if (isAnimating) return;
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

  }, 300);
}

/* ===== ZOOM (в точку клика, без дергания) ===== */
function initZoom() {
  const img = document.getElementById("artwork");

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

  img.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
  });

  img.addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;

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
  fetch('/sidebar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('sidebar-container').innerHTML = data;

      const file = window.location.pathname.split("/").pop();

      document.querySelectorAll('.menu-item a').forEach(link => {
        if (link.getAttribute('href') === file) {
          link.classList.add('active');
        }
      });
    });
}

/* ===== SUBMENU ===== */
function toggleSubmenu(id) {
  const submenu = document.getElementById('submenu-' + id);
  if (submenu) {
    submenu.style.display =
      submenu.style.display === 'flex' ? 'none' : 'flex';
  }
}

export async function initGalleryFromFolder(folderPath) {
  try {
    const res = await fetch(`${folderPath}/manifest.json`);
    const data = await res.json();

    const gallery = data.works.map(w => ({
      src: `${folderPath}/${w.file}`,
      title: w.title || "",
      meta: w.meta || ""
    }));

    initGallery(gallery);

  } catch (e) {
    console.error("Ошибка загрузки manifest.json:", e);
  }
}

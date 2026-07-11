let current = 0;
let gallery = [];
let navigationInitialized = false;

/* ===================================== */
/* INITIALIZATION */
/* ===================================== */

function initGallery(data) {
  if (!Array.isArray(data) || data.length === 0) {
    showGalleryError();
    return;
  }

  gallery = data;
  current = 0;

  render();
  preloadAdjacent();

  if (!navigationInitialized) {
    initNavigation();
    initLightbox();
    navigationInitialized = true;
  }
}

/* ===================================== */
/* ERROR */
/* ===================================== */

function showGalleryError() {
  const caption = document.getElementById("caption");

  if (caption) {
    caption.textContent = "Series not found.";
  }
}

/* ===================================== */
/* RENDER */
/* ===================================== */

function render() {
  const artwork = document.getElementById("artwork");
  const caption = document.getElementById("caption");
  const item = gallery[current];

  if (!artwork || !caption || !item) {
    return;
  }

  artwork.src = item.src;
  artwork.alt = item.title || "Artwork";

  caption.innerHTML = `
    ${item.title ? `<span class="caption-title">${item.title}</span>` : ""}
    ${item.meta ? `<span class="caption-meta">${item.meta}</span>` : ""}
  `;

  updateLightboxImage();
  preloadAdjacent();
}

/* ===================================== */
/* NEXT / PREVIOUS */
/* ===================================== */

function nextImage() {
  if (gallery.length < 2) {
    return;
  }

  current = (current + 1) % gallery.length;
  render();
}

function prevImage() {
  if (gallery.length < 2) {
    return;
  }

  current = (current - 1 + gallery.length) % gallery.length;
  render();
}

/* ===================================== */
/* PRELOAD */
/* ===================================== */

function preloadImage(index) {
  const item = gallery[index];

  if (!item) {
    return;
  }

  const image = new Image();
  image.src = item.src;
}

function preloadAdjacent() {
  if (gallery.length < 2) {
    return;
  }

  const nextIndex = (current + 1) % gallery.length;
  const previousIndex =
    (current - 1 + gallery.length) % gallery.length;

  preloadImage(nextIndex);
  preloadImage(previousIndex);
}

/* ===================================== */
/* NAVIGATION */
/* ===================================== */

function initNavigation() {
  const previousButton =
    document.querySelector(".gallery-previous");

  const nextButton =
    document.querySelector(".gallery-next");

  if (previousButton) {
    previousButton.addEventListener("click", prevImage);
  }

  if (nextButton) {
    nextButton.addEventListener("click", nextImage);
  }

  document.addEventListener("keydown", handleKeyboard);
}

/* ===================================== */
/* KEYBOARD */
/* ===================================== */

function handleKeyboard(event) {
  const lightbox = document.getElementById("lightbox");
  const lightboxIsOpen =
    lightbox && lightbox.classList.contains("is-open");

  if (lightboxIsOpen) {
    if (event.key === "Escape") {
      closeLightbox();
    }

    return;
  }

  if (event.key === "ArrowLeft") {
    prevImage();
  }

  if (event.key === "ArrowRight") {
    nextImage();
  }
}

/* ===================================== */
/* LIGHTBOX INITIALIZATION */
/* ===================================== */

function initLightbox() {
  const artwork = document.getElementById("artwork");
  const lightbox = document.getElementById("lightbox");

  if (!artwork || !lightbox) {
    return;
  }

  artwork.addEventListener("click", openLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

/* ===================================== */
/* OPEN LIGHTBOX */
/* ===================================== */

function openLightbox() {
  const lightbox = document.getElementById("lightbox");

  if (!lightbox) {
    return;
  }

  updateLightboxImage();

  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");

  document.body.classList.add("lightbox-open");
}

/* ===================================== */
/* CLOSE LIGHTBOX */
/* ===================================== */

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");

  if (!lightbox) {
    return;
  }

  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");

  document.body.classList.remove("lightbox-open");
}

/* ===================================== */
/* UPDATE LIGHTBOX IMAGE */
/* ===================================== */

function updateLightboxImage() {
  const lightboxImage =
    document.getElementById("lightbox-image");

  const item = gallery[current];

  if (!lightboxImage || !item) {
    return;
  }

  lightboxImage.src = item.src;
  lightboxImage.alt = item.title || "Artwork";
}

/* ===================================== */
/* EXPORT */
/* ===================================== */

window.initGallery = initGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;

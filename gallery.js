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
    navigationInitialized = true;
  }
}

/* ===================================== */
/* ERROR STATE */
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

  updateMobileNavigation();
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
/* NAVIGATION INITIALIZATION */
/* ===================================== */

function initNavigation() {
  const previousArrow = document.querySelector(".nav.prev");
  const nextArrow = document.querySelector(".nav.next");

  const mobilePrevious =
    document.querySelector(".mobile-gallery-previous");

  const mobileNext =
    document.querySelector(".mobile-gallery-next");

  const artwork = document.getElementById("artwork");

  if (previousArrow) {
    previousArrow.addEventListener("click", prevImage);
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", nextImage);
  }

  if (mobilePrevious) {
    mobilePrevious.addEventListener("click", prevImage);
  }

  if (mobileNext) {
    mobileNext.addEventListener("click", nextImage);
  }

  document.addEventListener("keydown", handleKeyboard);

  if (artwork) {
    initArtworkTap(artwork);
    initSwipe(artwork);
  }
}

/* ===================================== */
/* KEYBOARD */
/* ===================================== */

function handleKeyboard(event) {
  if (event.key === "ArrowRight") {
    nextImage();
  }

  if (event.key === "ArrowLeft") {
    prevImage();
  }
}

/* ===================================== */
/* MOBILE TAP */
/* ===================================== */

function initArtworkTap(artwork) {
  artwork.addEventListener("click", (event) => {
    if (window.innerWidth > 768) {
      return;
    }

    const rectangle = artwork.getBoundingClientRect();
    const clickPosition = event.clientX - rectangle.left;
    const middle = rectangle.width / 2;

    if (clickPosition < middle) {
      prevImage();
    } else {
      nextImage();
    }
  });
}

/* ===================================== */
/* MOBILE SWIPE */
/* ===================================== */

function initSwipe(artwork) {
  let startX = 0;
  let startY = 0;

  artwork.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.touches[0];

      startX = touch.clientX;
      startY = touch.clientY;
    },
    { passive: true }
  );

  artwork.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];

      const differenceX = startX - touch.clientX;
      const differenceY = startY - touch.clientY;

      const horizontalSwipe =
        Math.abs(differenceX) > Math.abs(differenceY);

      if (!horizontalSwipe || Math.abs(differenceX) < 45) {
        return;
      }

      if (differenceX > 0) {
        nextImage();
      } else {
        prevImage();
      }
    },
    { passive: true }
  );
}

/* ===================================== */
/* MOBILE NAVIGATION STATE */
/* ===================================== */

function updateMobileNavigation() {
  const previousButton =
    document.querySelector(".mobile-gallery-previous");

  const nextButton =
    document.querySelector(".mobile-gallery-next");

  if (!previousButton || !nextButton) {
    return;
  }

  const hasSeveralImages = gallery.length > 1;

  previousButton.hidden = !hasSeveralImages;
  nextButton.hidden = !hasSeveralImages;
}

/* ===================================== */
/* EXPORT */
/* ===================================== */

window.initGallery = initGallery;
window.nextImage = nextImage;
window.prevImage = prevImage;

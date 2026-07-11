function loadSidebar() {
  const container = document.getElementById("sidebar-container");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <!-- DESKTOP SIDEBAR -->
    <aside class="sidebar desktop-sidebar">

      <a href="/index.html" class="brand">
        <div class="name">darina grekhova</div>
      </a>

      <nav class="menu desktop-menu">
        <div class="menu-item">
          <a href="/gallery.html?series=quiexspectat">qui exspectat</a>
        </div>

        <div class="menu-item">
          <a href="/gallery.html?series=notnotfun">notnotfun</a>
        </div>

        <div class="menu-item">
          <a href="/gallery.html?series=foreigners">foreigners</a>
        </div>

        <div class="menu-item">
          <a href="/gallery.html?series=volante">volante</a>
        </div>

        <div class="menu-item">
          <a href="/gallery.html?series=half-known">half-known</a>
        </div>

        <div class="menu-item">
          <a href="/gallery.html?series=on-paper">on paper</a>
        </div>

        <div class="menu-item">
          <a href="/gallery.html?series=selected_drawings">
            selected drawings
          </a>
        </div>

        <div class="menu-item">
          <a href="/about.html">about</a>
        </div>

        <div class="menu-item">
          <a href="/cv.html">cv</a>
        </div>

        <div class="menu-item">
          <a href="/contact.html">contacts</a>
        </div>
      </nav>

    </aside>

    <!-- MOBILE NAVIGATION -->
    <div class="mobile-site-nav">

      <header class="mobile-header">

        <button
          class="mobile-brand-button"
          type="button"
          aria-expanded="false"
          aria-controls="mobile-series-menu"
        >
          darina grekhova
        </button>

        <nav
          class="mobile-series-menu"
          id="mobile-series-menu"
          aria-hidden="true"
        >
          <a href="/gallery.html?series=quiexspectat">
            qui exspectat
          </a>

          <a href="/gallery.html?series=notnotfun">
            notnotfun
          </a>

          <a href="/gallery.html?series=foreigners">
            foreigners
          </a>

          <a href="/gallery.html?series=volante">
            volante
          </a>

          <a href="/gallery.html?series=half-known">
            half-known
          </a>

          <a href="/gallery.html?series=on-paper">
            on paper
          </a>

          <a href="/gallery.html?series=selected_drawings">
            selected drawings
          </a>
        </nav>

      </header>

      <nav class="mobile-bottom-nav" aria-label="Main navigation">
        <a href="/about.html">about</a>
        <a href="/cv.html">cv</a>
        <a href="/contact.html">contacts</a>
      </nav>

    </div>
  `;

  highlightActiveLink();
  initMobileNavigation();
}

/* ===================================== */
/* ACTIVE LINK */
/* ===================================== */

function highlightActiveLink() {
  const currentPath = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  const currentSeries = params.get("series");

  document.querySelectorAll("a").forEach((link) => {
    const linkUrl = new URL(link.href, window.location.origin);
    const linkSeries = linkUrl.searchParams.get("series");

    const isCurrentSeries =
      currentSeries &&
      linkSeries &&
      currentSeries === linkSeries;

    const isCurrentPage =
      !currentSeries &&
      linkUrl.pathname === currentPath;

    if (isCurrentSeries || isCurrentPage) {
      link.classList.add("active");
    }
  });
}

/* ===================================== */
/* MOBILE MENU */
/* ===================================== */

function initMobileNavigation() {
  const button = document.querySelector(".mobile-brand-button");
  const menu = document.querySelector(".mobile-series-menu");

  if (!button || !menu) {
    return;
  }

  function openMenu() {
    menu.classList.add("is-open");
    menu.setAttribute("aria-hidden", "false");
    button.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    menu.classList.remove("is-open");
    menu.setAttribute("aria-hidden", "true");
    button.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = menu.classList.contains("is-open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  button.addEventListener("click", toggleMenu);

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", (event) => {
    const clickedInsideHeader = event.target.closest(".mobile-header");

    if (!clickedInsideHeader) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
      button.focus();
    }
  });
}

/* ===================================== */
/* EXPORT */
/* ===================================== */

window.loadSidebar = loadSidebar;

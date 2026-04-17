function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  container.innerHTML = `
    <div class="sidebar">
      <a href="/index.html" class="brand">
        <img src="images/logo.jpg" class="logo" alt="logo"/>
        <div class="name">darina grekhova</div>
      </a>

      <div class="menu">
        <div class="menu-item"><a href="/gallery.html?series=quiexspectat">qui exspectat</a></div>
        <div class="menu-item"><a href="/gallery.html?series=notnotfun">notnotfun</a></div>
        <div class="menu-item"><a href="/gallery.html?series=foreigners">foreigners</a></div>
        <div class="menu-item"><a href="/gallery.html?series=volante">volante</a></div>
        <div class="menu-item"><a href="/gallery.html?series=slavic-myth-on-canvas">slavic myth on canvas</a></div>
        <div class="menu-item"><a href="/gallery.html?series=slavic-myth-on-paper">slavic myth on paper</a></div>
        <div class="menu-item"><a href="/gallery.html?series=slavic-myth-on-paper">selected-independent</a></div>
        <div class="menu-item"><a href="/gallery.html?series=slavic-myth-on-paper">drawings</a></div>
        
        <div class="menu-item"><a href="/cv.html">cv</a></div>
        <div class="menu-item"><a href="/contact.html">contacts</a></div>
      </div>
    </div>
  `;

  highlightActiveLink();
  initMobileSidebar();
}

/* ===================================== */
/* ACTIVE LINK HIGHLIGHT */
/* ===================================== */

function highlightActiveLink() {
  const params = new URLSearchParams(window.location.search);
  const series = params.get("series");

  document.querySelectorAll(".menu-item a").forEach(link => {
    if (series && link.href.includes(series)) {
      link.classList.add("active");
    }
  });
}

/* ===================================== */
/* MOBILE TOGGLE (STABLE VERSION) */
/* ===================================== */

function initMobileSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const brand = document.querySelector(".brand");

  if (!sidebar || !brand) return;

  // remove old listeners by cloning (prevents duplication bugs)
  const newBrand = brand.cloneNode(true);
  brand.parentNode.replaceChild(newBrand, brand);

  newBrand.addEventListener("click", (e) => {
    if (window.innerWidth > 768) return;

    e.preventDefault();
    sidebar.classList.toggle("open");
  });

  // optional UX improvement: close menu after click on link
  document.querySelectorAll(".menu-item a").forEach(link => {
    link.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.remove("open");
      }
    });
  });

  // close on outside click
  document.addEventListener("click", (e) => {
    if (window.innerWidth > 768) return;

    if (!sidebar.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });
}

/* ===================================== */
/* EXPORT */
/* ===================================== */

window.loadSidebar = loadSidebar;

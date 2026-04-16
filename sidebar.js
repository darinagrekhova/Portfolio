function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  container.innerHTML = `
<div class="sidebar">
  <a href="/index.html" class="brand">
  <img src="images/logo.jpg" alt="logo" class="logo" />
    <div class="name">darina grekhova</div>
  </a>

  <div class="menu-item"><a href="/gallery.html?series=quiexspectat">qui exspectat</a></div>
  <div class="menu-item"><a href="/gallery.html?series=notnotfun">notnotfun</a></div>
  <div class="menu-item"><a href="/gallery.html?series=foreigners">foreigners</a></div>
  <div class="menu-item"><a href="/gallery.html?series=volante">volante</a></div>
  <div class="menu-item"><a href="/gallery.html?series=slavic-myth-on-canvas">slavic myth on canvas</a></div>
  <div class="menu-item"><a href="/gallery.html?series=slavic-myth-on-paper">slavic myth on paper</a></div>
  <div class="menu-item"><a href="/gallery.html?series=selected-independent">selected independent</a></div>
  <div class="menu-item"><a href="/gallery.html?series=drawings">drawings</a></div>

  <div class="menu-item"><a href="/cv.html">cv</a></div>
  <div class="menu-item"><a href="/contact.html">contacts</a></div>
</div>
  `;

  highlightActiveLink();
  initMobileSidebarToggle();
}

function highlightActiveLink() {
  const params = new URLSearchParams(window.location.search);
  const series = params.get("series");

  document.querySelectorAll(".menu-item a").forEach(link => {
    if (series && link.href.includes(series)) {
      link.classList.add("active");
    }
  });
}
function initMobileSidebarToggle() {
  const sidebar = document.querySelector(".sidebar");
  const brand = document.querySelector(".brand");

  if (!sidebar || !brand) return;

  brand.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

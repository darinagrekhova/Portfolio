function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  container.innerHTML = `
<div class="sidebar">
  <a href="/index.html" class="brand">
    <div class="name">darina grekhova</div>
  </a>

  <div class="menu-item"><a href="/quiexspectat.html">qui exspectat</a></div>
  <div class="menu-item"><a href="/notnotfun.html">notnotfun</a></div>
  <div class="menu-item"><a href="/foreigners.html">foreigners</a></div>
  <div class="menu-item"><a href="/volante.html">volante</a></div>
  <div class="menu-item"><a href="/slavic-myth-on-canvas.html">slavic myth on canvas</a></div>
  <div class="menu-item"><a href="/slavic-myth-on-paper.html">slavic myth on paper</a></div>
  <div class="menu-item"><a href="/selected-independent.html">selected independent</a></div>
  <div class="menu-item"><a href="/drawings.html">drawings</a></div>

  <div class="menu-item"><a href="/cv.html">cv</a></div>
  <div class="menu-item"><a href="/contact.html">contacts</a></div>
</div>
  `;

  highlightActiveLink();
}

function highlightActiveLink() {
  const file = window.location.pathname.split("/").pop();

  document.querySelectorAll(".menu-item a").forEach(link => {
    if (link.getAttribute("href").includes(file)) {
      link.classList.add("active");
    }
  });
}

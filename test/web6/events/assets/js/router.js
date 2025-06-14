document.addEventListener("DOMContentLoaded", () => {
  const components = [
    { id: "top-ad", path: "main/components/top_ads.html" },
    { id: "header", path: "main/components/header.html" },
    { id: "ribbon-links", path: "main/components/ribbon.html" },
    { id: "footer", path: "main/components/footer.html" },
    { id: "session-0", path: "main/sections/session0.html" },
    { id: "session-1", path: "main/sections/session1.html" },
    { id: "session-2", path: "main/sections/session2.html" },
    { id: "session-3", path: "main/sections/session3.html" },
    { id: "session-4", path: "main/sections/session4.html" },
    { id: "session-5", path: "main/sections/session5.html" },
    { id: "session-6", path: "main/sections/session6.html" },
    { id: "session-7", path: "main/sections/session7.html" },
    { id: "session-8", path: "main/sections/session8.html" },
    { id: "session-9", path: "main/sections/session9.html" }
  ];

  components.forEach(({ id, path }) => {
    fetch(path)
      .then(res => res.text())
      .then(html => {
        const target = document.getElementById(id);
        if (target) target.innerHTML = html;
      });
  });
});

function loadContent(path, targetId = "main-content") {
  fetch(path)
    .then(res => res.text())
    .then(html => {
      const container = document.getElementById(targetId);
      if (container) {
        container.innerHTML = html;
      }
    });
}
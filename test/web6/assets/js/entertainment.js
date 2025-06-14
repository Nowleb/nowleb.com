document.addEventListener("DOMContentLoaded", () => {
  const components = [
    { id: "top-ad", path: "main/components/top_ads.html" },
    { id: "header", path: "main/components/header.html" },
    { id: "ribbon-links", path: "main/components/ribbon.html" },
    { id: "footer", path: "main/components/footer.html" },
    { id: "session-0", path: "public/entertainment/sections/session0.html" },
    { id: "session-1", path: "public/entertainment/sections/session1.html" },
    { id: "session-2", path: "public/entertainment/sections/session2.html" },
    { id: "session-3", path: "public/entertainment/sections/session3.html" },
    { id: "session-4", path: "public/entertainment/sections/session4.html" },
    { id: "session-5", path: "public/entertainment/sections/session5.html" },
    { id: "session-6", path: "public/entertainment/sections/session6.html" },
    { id: "session-7", path: "public/entertainment/sections/session7.html" },
    { id: "session-8", path: "public/entertainment/sections/session8.html" },
    { id: "session-9", path: "public/entertainment/sections/session9.html" }
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
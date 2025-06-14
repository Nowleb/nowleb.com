document.addEventListener("DOMContentLoaded", () => {
  const components = [
    { id: "top-ad", path: "public/entertainment/components/top_ads.html" },
    { id: "header", path: "public/entertainment/components/header.html" },
    { id: "ribbon-links", path: "public/entertainment/components/ribbon.html" },
    { id: "footer", path: "public/entertainment/components/footer.html" },
    { id: "session-0", path: "public/entertainment/sections/session0.html" },
    { id: "ads_landing_0", path: "public/advertisement/ads_iframe/categories/entertainment/ads_landing_0.html" },
    { id: "session-1", path: "public/entertainment/sections/session1.html" },
    { id: "session-2", path: "public/entertainment/sections/session2.html" },
    { id: "session-3", path: "public/entertainment/sections/session3.html" },
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
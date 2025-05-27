document.addEventListener("DOMContentLoaded", () => {
  const components = [
    { id: "top-ad", path: "ads/top_ad/top_ad.html" },
    { id: "header", path: "header/header.html" },
    { id: "headline-ribbon", path: "ribbon/ribbon.html" },
    { id: "footer", path: "footer/footer.html" },
    { id: "session-1", path: "session1/session1.html" },
    { id: "session-2", path: "session2/session2.html" },
    { id: "session-3", path: "session3/session3.html" },
    { id: "session-4", path: "session4/session4.html" },
    { id: "session-5", path: "session5/session5.html" },
    { id: "session-6", path: "session6/session6.html" },
    { id: "session-7", path: "session7/session7.html" },
    { id: "session-8", path: "session8/session8.html" },
    { id: "session-9", path: "session9/session9.html" }
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

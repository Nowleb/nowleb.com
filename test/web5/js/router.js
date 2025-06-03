
// router.js
function loadContent(page) {
  fetch(`sections/${page}.html`)
    .then(response => response.text())
    .then(html => {
      document.getElementById("main-content").innerHTML = html;
    })
    .catch(error => console.error("Failed to load content:", error));
}

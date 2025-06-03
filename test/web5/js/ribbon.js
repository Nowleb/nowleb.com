
window.addEventListener("load", () => {
  fetch("data/ribbon_links.txt")
    .then(response => response.text())
    .then(text => {
      const lines = text.split("\n").filter(line => line.trim() !== "");
      const container = document.getElementById("ribbon-links");
      if (!container) {
        console.error("Missing #ribbon-links container");
        return;
      }
      lines.forEach(text => {
        const span = document.createElement("span");
        const a = document.createElement("a");
        a.href = "#";
        a.textContent = text;
        span.appendChild(a);
        container.appendChild(span);
      });
    })
    .catch(err => console.error("Failed to load ribbon links:", err));
});

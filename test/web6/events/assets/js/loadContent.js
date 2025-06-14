
document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("section-articles");
  fetch("/nowleb/public/includes/articles/categories/entertainment/article-2025-06-04.json")
    .then(response => response.json())
    .then(data => {
      container.innerHTML = `
        <h1>${data.title}</h1>
        <p><strong>Date:</strong> ${data.date} | <strong>Author:</strong> ${data.author}</p>
        <img src="/nowleb/${data.image}" alt="${data.imageAlt}" style="max-width:100%;height:auto;" />
        <p style="font-style:italic;">Image Credit: ${data.imageCredit}, Source: <a href="${data.imageSource}" target="_blank">${data.imageSource}</a></p>
        <div>${data.content}</div>
        <p><strong>Tags:</strong> ${data.tags.join(', ')}</p>
      `;
    })
    .catch(err => {
      container.innerHTML = "<p>Unable to load article at this time.</p>";
      console.error("Error loading article:", err);
    });
});

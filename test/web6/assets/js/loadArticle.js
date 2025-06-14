
document.addEventListener("DOMContentLoaded", function () {
  fetch("blake-lively-justin-baldoni.json")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("post-title").textContent = data.title;
      document.getElementById("post-author").textContent = "By " + data.author;
      document.getElementById("post-date").textContent = new Date(data.date).toDateString();
      document.getElementById("post-category").textContent = data.category;
      document.getElementById("post-image").src = data.image;
      document.getElementById("post-image").alt = data.imageAlt;
      document.getElementById("post-image-credit").textContent = "Image Credit: " + data.imageCredit;

      // Format content: split into paragraphs
      const paragraphs = data.content.split("\n\n");
      const contentContainer = document.getElementById("post-content");
      paragraphs.forEach((p) => {
        const para = document.createElement("p");
        para.textContent = p;
        contentContainer.appendChild(para);
      });
    })
    .catch((error) => console.error("Error loading article:", error));
});

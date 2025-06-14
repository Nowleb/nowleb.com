
document.addEventListener("DOMContentLoaded", function () {
  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  const postFilename = getQueryParam("post");
  if (!postFilename) {
    document.body.innerHTML = "<h2>No article specified. Use ?post=filename.json</h2>";
    return;
  }

  fetch(postFilename)
    .then((response) => {
      if (!response.ok) throw new Error("File not found.");
      return response.json();
    })
    .then((data) => {
      document.getElementById("post-title").textContent = data.title;
      document.getElementById("post-author").textContent = "By " + data.author;
      document.getElementById("post-date").textContent = new Date(data.date).toDateString();
      document.getElementById("post-category").textContent = data.category;
      document.getElementById("post-image").src = data.image;
      document.getElementById("post-image").alt = data.imageAlt;
      document.getElementById("post-image-credit").textContent = "Image Credit: " + data.imageCredit;

      const paragraphs = data.content.split("\n\n");
      const contentContainer = document.getElementById("post-content");
      paragraphs.forEach((p) => {
        const para = document.createElement("p");
        para.textContent = p;
        contentContainer.appendChild(para);
      });
    })
    .catch((error) => {
      document.body.innerHTML = "<h2>Error loading article: " + error.message + "</h2>";
    });
});

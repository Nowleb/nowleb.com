// articleAdminPanel.js
function addArticle() {
  const title = document.getElementById("title").value.trim();
  const dateVal = document.getElementById("date").value || new Date().toISOString().slice(0, 10);
  const author = document.getElementById("author").value.trim() || "Nowleb Newsroom";
  const category = document.getElementById("category").value.toLowerCase();
  const subcategory = document.getElementById("subcategory").value.trim().toLowerCase();
  const format = document.getElementById("format").value;
  const tags = document.getElementById("tags").value.split(',').map(t => t.trim()).filter(Boolean);
  const image = document.getElementById("image").value.trim();
  const imageAlt = document.getElementById("imageAlt").value.trim();
  const imageSource = document.getElementById("imageSource").value.trim();
  const imageCredit = document.getElementById("imageCredit").value.trim();
  const content = document.getElementById("content").value.trim();

  const article = {
    title,
    date: dateVal,
    author,
    format,
    tags,
    image,
    imageAlt,
    imageSource,
    imageCredit,
    content
  };

  const filename = `article-${dateVal}.json`;
  const path = `/nowleb/public/includes/articles/categories/${category}/${subcategory}/${filename}`;

  const pre = document.createElement("pre");
  pre.textContent = `Path: ${path}\n\n` + JSON.stringify(article, null, 2);
  document.getElementById("articles").prepend(pre);
}

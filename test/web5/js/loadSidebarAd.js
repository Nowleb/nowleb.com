
function loadSidebarAd(section) {
  fetch("ads/top/ads.json")
    .then(res => res.json())
    .then(data => {
      const adSize = window.innerWidth >= 768 ? "300x250" : "300x250";
      const ads = (data[section] && data[section][adSize]) || data["default"][adSize] || [];
      const ad = ads[Math.floor(Math.random() * ads.length)];
      if (ad) {
        document.getElementById("sidebar-ad").innerHTML = `
          <div class="ad-slot">
            <div class="top-ad-label">Advertisement</div>
            <a href="\${ad.link}" target="_blank">
              <img src="\${ad.image}" alt="\${ad.title}" style="width:100%; max-width:300px; height:auto;">
            </a>
          </div>
        `;
      }
    })
    .catch(err => console.error("Sidebar ad load error:", err));
}

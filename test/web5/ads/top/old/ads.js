
document.addEventListener("DOMContentLoaded", () => {
  const adContainer = document.getElementById("rotating-ad-slot");
  const section = sessionStorage.getItem("nowleb_section") || "default";
  const adSize = window.innerWidth >= 768 ? "728x90" : "300x250";

  fetch("ads/top/ads.json")
    .then(response => response.json())
    .then(data => {
      const sectionAds = data[section] || data["default"];
      const ads = sectionAds[adSize] || [];
      if (!ads.length) return;

      let index = 0;
      const showAd = () => {
        const ad = ads[index];
        adContainer.innerHTML = `
          <div class="ad-slot-header__wrapper">
            <div class="top-ad-label">Advertisement</div>
            <a href="${ad.link}" target="_blank">
              <img src="${ad.image}" alt="${ad.title}" class="ad-img" />
            </a>
          </div>
        `;
        index = (index + 1) % ads.length;
      };

      showAd();
      setInterval(showAd, 10000);
    })
    .catch(err => console.error("Ad loading error:", err));
});

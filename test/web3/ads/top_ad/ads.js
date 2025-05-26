
let adIndex = 0;
let adsData = [];

// Load ads from JSON
fetch('ads.json')
  .then(res => res.json())
  .then(ads => {
    adsData = ads;
    shuffleArray(adsData);
    loadMoreAds(5); // Load initial 5 ads
  });

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadMoreAds(count) {
  const wrapper = document.querySelector('.ad-wrapper');

  for (let i = 0; i < count && adIndex < adsData.length; i++, adIndex++) {
    const ad = adsData[adIndex];

    const div = document.createElement('div');
    div.className = 'ad-slot';

    const a = document.createElement('a');
    a.href = ad.link;
    a.target = '_blank';

    const img = document.createElement('img');
    img.src = ad.img;
    img.alt = 'Advertisement';
    img.loading = 'lazy';

    // Auto-assign class based on image size
    const sizeMatch = ad.img.match(/(\d{2,4})x(\d{2,4})/);
    if (sizeMatch) {
      div.classList.add(`ad-${sizeMatch[0]}`);
    }

    const label = document.createElement('div');
    label.className = 'top-ad-label';
    label.textContent = 'Advertisement';

    a.appendChild(img);
    div.appendChild(a);
    div.appendChild(label);
    wrapper.appendChild(div);
  }
}

// Infinite scroll trigger
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreAds(3);
  }
});

// Refresh ads every 60 seconds (optional)
setInterval(() => {
  const wrapper = document.querySelector('.ad-wrapper');
  wrapper.innerHTML = '';
  adIndex = 0;
  shuffleArray(adsData);
  loadMoreAds(5);
}, 60000);

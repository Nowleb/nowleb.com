
let adIndex = 0;
let adsData = [];

// Load ads
fetch('ads.json')
  .then(res => res.json())
  .then(ads => {
    adsData = ads;
    loadMoreAds(4); // initial batch
  });

function loadMoreAds(count) {
  const wrapper = document.querySelector('.ad-wrapper');
  for (let i = 0; i < count && adIndex < adsData.length; i++, adIndex++) {
    const ad = adsData[adIndex];
    const div = document.createElement('div');
    div.className = 'ad-slot';

    if (ad.type === "image") {
      const a = document.createElement('a');
      a.href = ad.link;
      a.target = "_blank";

      const img = document.createElement('img');
      img.src = ad.img;
      img.alt = "Advertisement";
      img.loading = "lazy";

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

    } else if (ad.type === "google") {
      const label = document.createElement('div');
      label.className = 'top-ad-label';
      label.textContent = 'Advertisement';

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', 'ca-pub-0000000000000000');
      ins.setAttribute('data-ad-slot', ad.slot);
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');

      const script = document.createElement('script');
      script.innerHTML = '(adsbygoogle = window.adsbygoogle || []).push({});';

      div.appendChild(label);
      div.appendChild(ins);
      div.appendChild(script);
    }

    wrapper.appendChild(div);
  }
}

// Infinite scroll
window.addEventListener('scroll', () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    loadMoreAds(2);
  }
});

// Auto refresh every 60 seconds
setInterval(() => {
  document.querySelector('.ad-wrapper').innerHTML = '';
  adIndex = 0;
  loadMoreAds(4);
}, 60000);

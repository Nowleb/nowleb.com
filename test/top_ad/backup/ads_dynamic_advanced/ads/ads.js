
fetch('ads.json')
  .then(res => res.json())
  .then(ads => {
    const wrapper = document.querySelector('.ad-wrapper');

    // Random rotation: shuffle ads
    ads = ads.sort(() => 0.5 - Math.random());

    // Optional: limit to first N ads
    const displayLimit = 5;
    ads.slice(0, displayLimit).forEach(ad => {
      const div = document.createElement('div');
      div.className = 'ad-slot';

      const a = document.createElement('a');
      a.href = ad.link;
      a.target = '_blank';

      const img = document.createElement('img');
      img.src = ad.img;
      img.alt = 'Advertisement';
      img.loading = 'lazy'; // Lazy load image

      // Auto-assign class based on image size if size info is in filename (e.g., ad-300x250.jpg)
      const sizeMatch = ad.img.match(/(\d{2,4})x(\d{2,4})/);
      if (sizeMatch) {
        div.classList.add(`ad-${sizeMatch[0]}`);
      }

      a.appendChild(img);
      div.appendChild(a);
      wrapper.appendChild(div);
    });
  })
  .catch(err => console.error('Failed to load ads:', err));

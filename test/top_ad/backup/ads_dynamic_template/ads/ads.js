fetch('ads.json')
  .then(res => res.json())
  .then(ads => {
    const wrapper = document.querySelector('.ad-wrapper');
    ads.forEach(ad => {
      const div = document.createElement('div');
      div.className = 'ad-slot';

      const a = document.createElement('a');
      a.href = ad.link;
      a.target = '_blank';

      const img = document.createElement('img');
      img.src = ad.img;
      img.alt = 'Advertisement';

      a.appendChild(img);
      div.appendChild(a);
      wrapper.appendChild(div);
    });
  })
  .catch(err => console.error('Failed to load ads:', err));

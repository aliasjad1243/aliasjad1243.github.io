// Instagram-style stories for the "Outside the Lab" section.
(function(){
  const items = [...document.querySelectorAll('.story')];
  const v = document.getElementById('sv');
  if (!items.length || !v) return;
  const bars = v.querySelector('.sv-bars'), stage = v.querySelector('.sv-stage');
  const cap = v.querySelector('.sv-cap'), muteBtn = v.querySelector('.sv-mute');
  const PHOTO_MS = 5000;
  let i = 0, raf = 0, media = null, muted = true, start = 0;

  items.forEach((b, k) => {
    const s = document.createElement('span'); s.appendChild(document.createElement('i')); bars.appendChild(s);
    b.addEventListener('click', () => open(k));
  });

  function setBars(p){
    [...bars.children].forEach((s, k) => { s.firstChild.style.width = (k < i ? 100 : k > i ? 0 : Math.min(1, p) * 100) + '%'; });
  }
  function stop(){
    cancelAnimationFrame(raf);
    if (media && media.tagName === 'VIDEO') { media.pause(); media.removeAttribute('src'); media.load(); }
    media = null;
  }
  function show(k){
    stop(); i = k;
    const d = items[k].dataset;
    items[k].classList.add('seen');
    stage.innerHTML = ''; cap.textContent = d.caption; setBars(0);
    const hasAudio = d.audio === '1';
    muteBtn.hidden = !hasAudio; updateMute();
    if (d.type === 'video') {
      const vid = document.createElement('video');
      vid.src = d.src; vid.playsInline = true; vid.setAttribute('playsinline', ''); vid.preload = 'auto';
      vid.muted = hasAudio ? muted : true;
      vid.addEventListener('ended', next);
      stage.appendChild(vid); media = vid;
      vid.play().catch(() => { vid.muted = true; vid.play().catch(() => {}); });
      const tick = () => { if (media === vid && vid.duration) setBars(vid.currentTime / vid.duration); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    } else {
      const img = new Image(); img.src = d.src; img.alt = d.caption;
      stage.appendChild(img); media = img; start = performance.now();
      const tick = t => { const p = (t - start) / PHOTO_MS; setBars(p); if (p >= 1) { next(); return; } raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
  }
  function next(){ i < items.length - 1 ? show(i + 1) : close(); }
  function prev(){ show(Math.max(0, i - 1)); }
  function open(k){ v.hidden = false; document.body.style.overflow = 'hidden'; show(k); }
  function close(){ stop(); stage.innerHTML = ''; v.hidden = true; document.body.style.overflow = ''; }
  function updateMute(){ muteBtn.textContent = muted ? '🔇' : '🔊'; muteBtn.setAttribute('aria-label', muted ? 'Unmute' : 'Mute'); }

  muteBtn.addEventListener('click', e => {
    e.stopPropagation(); muted = !muted; updateMute();
    if (media && media.tagName === 'VIDEO') media.muted = muted;
  });
  v.querySelector('.sv-next').addEventListener('click', next);
  v.querySelector('.sv-prev').addEventListener('click', prev);
  v.querySelector('.sv-close').addEventListener('click', close);
  v.addEventListener('click', e => { if (e.target === v) close(); });
  addEventListener('keydown', e => {
    if (v.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
  let y0 = null;
  v.addEventListener('touchstart', e => { y0 = e.touches[0].clientY; }, {passive:true});
  v.addEventListener('touchend', e => { if (y0 !== null && e.changedTouches[0].clientY - y0 > 90) close(); y0 = null; });
})();

// Shared behaviour for every page.

// Image fallbacks: called from each <img onerror="miss(this, mode)">
function miss(img, mode){
  if (mode === 'remove') { (img.closest('figure') || img).remove(); return; }
  if (mode === 'photo')  { img.closest('.row').classList.add('no-photo'); img.remove(); return; }
  if (mode === 'head')   { img.closest('.intro').classList.add('no-photo'); img.remove(); return; }
  if (mode === 'tile')   { img.parentElement.classList.add('missing'); img.remove(); return; }
  if (img.parentElement.classList.contains('banner')) img.parentElement.classList.add('empty');
  img.remove(); // band / banner: keep the navy background
}

document.addEventListener('DOMContentLoaded', () => {
  // Nav: transparent over a hero, solid everywhere else
  const nav = document.querySelector('nav');
  const hero = document.querySelector('.hero');
  const setNav = () => nav.classList.toggle('solid', !hero || scrollY > hero.offsetHeight * 0.55);
  addEventListener('scroll', setNav, {passive:true}); setNav();

  // Experience page: highlight the sub-nav pill for the section on screen
  const pills = [...document.querySelectorAll('.subnav a')];
  if (pills.length) {
    const secs = pills.map(a => document.querySelector(a.getAttribute('href')));
    const mark = () => {
      let k = 0;
      secs.forEach((s,i) => { if (s && s.getBoundingClientRect().top < innerHeight * 0.4) k = i; });
      pills.forEach((p,i) => p.classList.toggle('on', i === k));
    };
    addEventListener('scroll', mark, {passive:true}); mark();
  }
});

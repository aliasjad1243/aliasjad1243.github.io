// Interactive wireframe for any .thumb.wire[data-stl] tile.
// Loads Three.js only when such a tile exists; falls back to the static PNG already in the tile.
(function(){
  const tiles = document.querySelectorAll('.thumb.wire[data-stl]');
  if (!tiles.length) return;
  const load = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = no; document.head.appendChild(s); });
  const base = 'https://cdn.jsdelivr.net/npm/three@0.128.0/';
  load(base + 'build/three.min.js')
    .then(() => Promise.all([load(base + 'examples/js/loaders/STLLoader.js'), load(base + 'examples/js/controls/OrbitControls.js')]))
    .then(() => tiles.forEach(init))
    .catch(() => {}); // keep the static image

  function init(tile){
    const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.001, 10);
    new THREE.STLLoader().load(tile.dataset.stl, geo => {
      geo.center(); geo.computeBoundingSphere();
      const r = geo.boundingSphere.radius;
      const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo),
        new THREE.LineBasicMaterial({color:0xffffff, transparent:true, opacity:.55}));
      wire.rotation.x = -Math.PI/2; // STL is Z-up
      scene.add(wire);
      camera.position.set(r*2.2, r*1.4, r*2.8); camera.lookAt(0,0,0);
      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false; controls.enablePan = false; controls.enableDamping = true;
      controls.autoRotate = !matchMedia('(prefers-reduced-motion: reduce)').matches; controls.autoRotateSpeed = 2.2;
      const img = tile.querySelector('img'); if (img) img.remove();
      tile.prepend(renderer.domElement);
      const size = () => { const w = tile.clientWidth, h = tile.clientHeight; renderer.setSize(w, h, false); camera.aspect = w/h; camera.updateProjectionMatrix(); };
      size(); addEventListener('resize', size);
      (function loop(){ controls.update(); renderer.render(scene, camera); requestAnimationFrame(loop); })();
    });
  }
})();

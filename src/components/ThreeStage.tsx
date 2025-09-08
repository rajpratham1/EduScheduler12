
import React, { useEffect, useRef } from 'react';

export default function ThreeStage() {
  const mountRef = useRef(null);

  useEffect(() => {
    let THREE;
    let renderer, scene, camera, cube, frameId;
    (async () => {
      THREE = await import('three');
      const el = mountRef.current;
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(el.clientWidth || 300, el.clientHeight || 200);
      el.appendChild(renderer.domElement);

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, (el.clientWidth||300)/(el.clientHeight||200), 0.1, 1000);
      camera.position.z = 5;

      const geometry = new THREE.BoxGeometry();
      const material = new THREE.MeshNormalMaterial();
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const animate = () => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.012;
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(animate);
      };
      animate();
    })();

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      if (mountRef.current) mountRef.current.innerHTML = '';
      if (renderer && renderer.dispose) renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: 300 }} />;
}

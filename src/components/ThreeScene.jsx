import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Tube from "./Tube";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    const w = el.clientWidth;
    const h = el.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e1e1e);
    
    // 2. Grid
    const grid = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(grid);

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 1000);
    camera.position.set(5, 5, 8);

    // 4. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(window.devicePixelRatio);
    el.appendChild(renderer.domElement);

    // 5. Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(5, 10, 5);
    scene.add(dir);

    // 6. Controls
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    // --- NEW: Add a Static Test Tube ---
    const testTube = Tube({ 
      width: 1, 
      height: 1, 
      thickness: 0.1, 
      length: 3, 
      wireframe: false 
    });
    // Lift it up slightly so it sits on the grid
    testTube.position.y = 0.5; 
    scene.add(testTube);
    // -----------------------------------

    // Animation Loop
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      renderer.dispose();
      if (el && el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;
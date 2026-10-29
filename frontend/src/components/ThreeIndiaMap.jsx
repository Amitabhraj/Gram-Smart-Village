import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeIndiaMap({ selectedPlace, places, onSelectPlace }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Dimensions
    const width = currentMount.clientWidth || window.innerWidth;
    const height = currentMount.clientHeight || 560;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a1120, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    camera.position.set(0, -25, 110);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    currentMount.appendChild(renderer.domElement);

    // Group for India 3D Model
    const indiaGroup = new THREE.Group();
    scene.add(indiaGroup);

    // Simplified polygon outline of India in normalized coordinates [-30 to +30 range]
    // Normalized approx: Lat 8N to 36N, Lng 68E to 97E
    const indiaOutlineCoords = [
      [-10, 24], [-6, 26], [-2, 28], [2, 28], [4, 25], [1, 23], [4, 20],
      [8, 20], [14, 22], [16, 20], [18, 17], [16, 15], [12, 16], [10, 14],
      [7, 10], [10, 8], [8, 4], [5, -4], [2, -10], [0, -18], [-2, -24],
      [-3, -22], [-5, -16], [-7, -10], [-9, -4], [-12, 2], [-14, 4],
      [-16, 8], [-19, 10], [-17, 14], [-13, 16], [-14, 20], [-10, 24]
    ];

    // 1. Draw boundary line
    const boundaryPoints = indiaOutlineCoords.map(([x, y]) => new THREE.Vector3(x, y, 0));
    const boundaryGeometry = new THREE.BufferGeometry().setFromPoints(boundaryPoints);
    const boundaryMaterial = new THREE.LineBasicMaterial({
      color: 0x10b981,
      linewidth: 2,
      transparent: true,
      opacity: 0.85
    });
    const boundaryLine = new THREE.LineLoop(boundaryGeometry, boundaryMaterial);
    indiaGroup.add(boundaryLine);

    // 2. Extruded 3D base geometry
    const shape = new THREE.Shape();
    indiaOutlineCoords.forEach(([x, y], idx) => {
      if (idx === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    shape.closePath();

    const extrudeSettings = {
      depth: 3.5,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.6,
      bevelThickness: 0.4
    };

    const landGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const landMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.7,
      wireframe: false,
    });
    const landMesh = new THREE.Mesh(landGeometry, landMaterial);
    landMesh.position.z = -3.5;
    indiaGroup.add(landMesh);

    // 3. Grid wireframe overlay on land surface
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x059669,
      wireframe: true,
      transparent: true,
      opacity: 0.18
    });
    const wireMesh = new THREE.Mesh(landGeometry, wireMaterial);
    wireMesh.position.z = -3.4;
    indiaGroup.add(wireMesh);

    // 4. Dot matrix / particle terrain
    const particleCount = 700;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleScales = new Float32Array(particleCount);

    let pIdx = 0;
    while (pIdx < particleCount) {
      const rx = (Math.random() - 0.5) * 36;
      const ry = (Math.random() - 0.5) * 50;
      // Rough filter inside India box
      if (
        (ry > -24 && ry < 27) &&
        (rx > -18 && rx < 18) &&
        (ry < 0 ? Math.abs(rx) < (ry + 26) * 0.7 : true)
      ) {
        particlePositions[pIdx * 3] = rx;
        particlePositions[pIdx * 3 + 1] = ry;
        particlePositions[pIdx * 3 + 2] = 0.5 + Math.random() * 2;
        particleScales[pIdx] = Math.random() * 0.8 + 0.3;
        pIdx++;
      }
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const pMaterial = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.9,
      transparent: true,
      opacity: 0.65,
    });
    const particleSystem = new THREE.Points(particleGeometry, pMaterial);
    indiaGroup.add(particleSystem);

    // 5. Village Location Radar Beacons
    const beaconsGroup = new THREE.Group();
    indiaGroup.add(beaconsGroup);

    const keyNodes = [
      { name: 'Pipariya', x: -1.5, y: 3.5, active: true },
      { name: 'Rampur', x: -3.0, y: 2.8, active: true },
      { name: 'Khedi', x: -5.0, y: 4.5, active: true },
      { name: 'Semri', x: -2.0, y: 3.8, active: true },
      { name: 'Mandla', x: 2.5, y: 2.2, active: true },
      { name: 'Delhi NCR', x: -4.0, y: 15.0, active: false },
      { name: 'Bhopal (Hub)', x: -3.5, y: 4.0, active: false },
      { name: 'Nagpur', x: 0.5, y: 0.5, active: false },
    ];

    const beaconPointers = [];
    keyNodes.forEach((node) => {
      // Beacon cylinder pin
      const pinGeom = new THREE.CylinderGeometry(0.2, 0.2, 4.5, 8);
      const pinMat = new THREE.MeshBasicMaterial({
        color: node.active ? 0x10b981 : 0x38bdf8,
        transparent: true,
        opacity: 0.9
      });
      const pin = new THREE.Mesh(pinGeom, pinMat);
      pin.position.set(node.x, node.y, 2.25);
      pin.rotation.x = Math.PI / 2;
      beaconsGroup.add(pin);

      // Radar ring
      const ringGeom = new THREE.RingGeometry(0.7, 1.1, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: node.active ? 0x34d399 : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      });
      const ring = new THREE.Mesh(ringGeom, ringMat);
      ring.position.set(node.x, node.y, 0.4);
      beaconsGroup.add(ring);

      beaconPointers.push({ ring, pin, node, baseScale: 1 });
    });

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0x334155, 1.2);
    scene.add(ambientLight);

    const directLight = new THREE.DirectionalLight(0x38bdf8, 2.5);
    directLight.position.set(20, 30, 50);
    scene.add(directLight);

    const greenPointLight = new THREE.PointLight(0x10b981, 4, 80);
    greenPointLight.position.set(0, 5, 20);
    scene.add(greenPointLight);

    // Initial slight tilt
    indiaGroup.rotation.x = 0.35;
    indiaGroup.rotation.y = -0.05;

    // Mouse movement parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetRotX = 0.35;
    let targetRotY = -0.05;

    const handleMouseMove = (e) => {
      const rect = currentMount.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouseX = (clientX / width) * 2 - 1;
      mouseY = -(clientY / height) * 2 + 1;
      targetRotY = mouseX * 0.35;
      targetRotX = 0.35 - mouseY * 0.25;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth || window.innerWidth;
      const newHeight = currentMount.clientHeight || 560;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damping towards mouse position
      indiaGroup.rotation.y += (targetRotY - indiaGroup.rotation.y) * 0.05;
      indiaGroup.rotation.x += (targetRotX - indiaGroup.rotation.x) * 0.05;

      // Gentle floating animation
      indiaGroup.position.z = Math.sin(elapsedTime * 1.2) * 1.2;

      // Pulse radar rings
      beaconPointers.forEach((item, i) => {
        const pulse = 1 + Math.sin(elapsedTime * 3 + i) * 0.4;
        item.ring.scale.set(pulse, pulse, 1);
        item.ring.material.opacity = Math.max(0.1, 0.8 - (pulse - 0.8));
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
      <div ref={mountRef} className="w-full h-full" />
      {/* Subtle vignette & scanline effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/70" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,15,30,0.85)_100%)]" />
    </div>
  );
}

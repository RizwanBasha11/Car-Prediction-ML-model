import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeCarShowcase = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 400;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 2.5, 6);
    camera.lookAt(0, 0.3, 0);

    // 2. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 3. Create Procedural Hologram Car Group
    const carGroup = new THREE.Group();

    // Materials
    const cyanWireframe = new THREE.MeshBasicMaterial({
      color: 0x00E5FF,
      wireframe: true,
      transparent: true,
      opacity: 0.8
    });

    const purpleWireframe = new THREE.MeshBasicMaterial({
      color: 0x7C3AED,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });

    const greenWireframe = new THREE.MeshBasicMaterial({
      color: 0x00FFA3,
      wireframe: true,
      transparent: true,
      opacity: 0.9
    });

    // Car Body - Main Chassis
    const chassisGeo = new THREE.BoxGeometry(2.4, 0.35, 1.1, 12, 4, 6);
    const chassis = new THREE.Mesh(chassisGeo, cyanWireframe);
    chassis.position.y = 0.35;
    carGroup.add(chassis);

    // Car Cabin (Top Roof)
    const cabinGeo = new THREE.BoxGeometry(1.2, 0.45, 0.9, 8, 4, 4);
    const cabin = new THREE.Mesh(cabinGeo, purpleWireframe);
    cabin.position.set(-0.1, 0.75, 0);
    carGroup.add(cabin);

    // Aerodynamic Spoiler (Wing)
    const spoilerGeo = new THREE.BoxGeometry(0.15, 0.1, 1.1, 2, 2, 4);
    const spoiler = new THREE.Mesh(spoilerGeo, greenWireframe);
    spoiler.position.set(-1.15, 0.6, 0);
    carGroup.add(spoiler);
    
    // Spoiler struts
    const strutL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.25, 0.05), cyanWireframe);
    strutL.position.set(-1.1, 0.45, 0.45);
    const strutR = strutL.clone();
    strutR.position.z = -0.45;
    carGroup.add(strutL);
    carGroup.add(strutR);

    // Wheels (4 Cylinders)
    const wheelGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.25, 12, 1);
    
    const wheels = [];
    const wheelPositions = [
      { x: 0.7, y: 0.3, z: 0.6 },   // Front Left
      { x: 0.7, y: 0.3, z: -0.6 },  // Front Right
      { x: -0.7, y: 0.3, z: 0.6 },  // Rear Left
      { x: -0.7, y: 0.3, z: -0.6 }  // Rear Right
    ];

    wheelPositions.forEach((pos) => {
      const wheel = new THREE.Mesh(wheelGeo, purpleWireframe);
      wheel.rotation.x = Math.PI / 2; // Orient cylinder as wheel
      wheel.position.set(pos.x, pos.y, pos.z);
      carGroup.add(wheel);
      wheels.push(wheel);
    });

    scene.add(carGroup);

    // 4. Ground Grid Helper (futuristic highway look)
    const gridHelper = new THREE.GridHelper(30, 30, 0x00E5FF, 0x7C3AED);
    gridHelper.position.y = 0;
    scene.add(gridHelper);

    // 5. Lights (for atmosphere, even though wireframe doesn't use lighting, we can add a glowing light orb)
    const light = new THREE.PointLight(0x00E5FF, 2, 10);
    light.position.set(0, 2, 2);
    scene.add(light);

    // Mouse Interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event) => {
      // Normalize mouse between -0.5 and 0.5
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width) - 0.5;
      mouseY = ((event.clientY - rect.top) / height) - 0.5;
    };

    container.addEventListener('mousemove', onMouseMove);

    // 6. Animation Loop
    let clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();

      // Slow idle rotation
      carGroup.rotation.y = elapsedTime * 0.15;
      
      // Slide grid to simulate driving
      gridHelper.position.z = (elapsedTime * 1.5) % 1.0;

      // Spin wheels
      wheels.forEach((wheel) => {
        wheel.rotation.y = -elapsedTime * 6; // cylinders rotate on local Y axis after PI/2 rotation
      });

      // Hover bobbing effect
      carGroup.position.y = Math.sin(elapsedTime * 2.0) * 0.06;

      // Mouse control dampening
      targetX = mouseX * 0.8;
      targetY = mouseY * 0.5;

      carGroup.rotation.z = THREE.MathUtils.lerp(carGroup.rotation.z, -targetX * 0.6, 0.05);
      carGroup.rotation.x = THREE.MathUtils.lerp(carGroup.rotation.x, targetY * 0.4, 0.05);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    animate();

    // 7. Handle Resize
    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight || 400;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      container.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[320px] md:h-[400px] relative cursor-pointer"
    >
      <div className="absolute top-2 left-2 text-[10px] text-autoversePrimary uppercase tracking-widest bg-autoverseBg/80 px-2 py-1 rounded border border-autoversePrimary/20">
        3D HOLOGRAM INJECTOR ACTIVE
      </div>
      <div className="absolute bottom-2 right-2 text-[10px] text-autoverseAccent uppercase tracking-widest bg-autoverseBg/80 px-2 py-1 rounded border border-autoverseAccent/20">
        REACTIVE TO CURSOR
      </div>
    </div>
  );
};

export default ThreeCarShowcase;

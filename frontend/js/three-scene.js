import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

/**
 * CORTEX SHIELD - ENHANCED 3D SCENE
 * Beautiful particle system with warm vibrant colors
 * Smooth animations and advanced visual effects
 */

export function initThreeScene() {
  const container = document.getElementById('three-container');
  if (!container) return;

  // Scene setup
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x1a0f2e, 0.002); // Warm fog effect
  
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  
  const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
  });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  
  camera.position.z = 60;

  // Warm color palette
  const colors = {
    primary: 0xff6b35,    // Vibrant Orange
    secondary: 0xf7931e,  // Golden Amber
    accent: 0xff9a76,     // Coral
    highlight: 0xffd93d,  // Sunny Yellow
    tertiary: 0xe91e63,   // Pink
    purple: 0x9b59b6      // Purple
  };
  
  const colorArray = Object.values(colors);

  // Create particle system with varied sizes and colors
  const nodes = [];
  const particleGroups = [];
  
  // Main nodes - larger glowing spheres
  for (let i = 0; i < 80; i++) {
    const size = Math.random() * 0.4 + 0.2;
    const geometry = new THREE.SphereGeometry(size, 16, 16);
    const color = colorArray[Math.floor(Math.random() * colorArray.length)];
    
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.7 + Math.random() * 0.3,
    });
    
    const node = new THREE.Mesh(geometry, material);
    node.position.set(
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 120,
      (Math.random() - 0.5) * 120
    );
    
    // Store initial position and velocity for organic movement
    node.userData = {
      originalColor: color,
      velocity: {
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.01
      },
      phase: Math.random() * Math.PI * 2,
      pulseSpeed: 0.5 + Math.random() * 0.5
    };
    
    nodes.push(node);
    scene.add(node);
    
    // Add glowing aura around each node
    const glowGeometry = new THREE.SphereGeometry(size * 1.5, 16, 16);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    node.add(glow);
  }
  
  // Ambient particles - smaller floating dots
  const ambientParticleGeometry = new THREE.BufferGeometry();
  const ambientParticleCount = 300;
  const positions = new Float32Array(ambientParticleCount * 3);
  const colorsAttr = new Float32Array(ambientParticleCount * 3);
  
  for (let i = 0; i < ambientParticleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 200;
    positions[i + 1] = (Math.random() - 0.5) * 200;
    positions[i + 2] = (Math.random() - 0.5) * 200;
    
    const color = new THREE.Color(colorArray[Math.floor(Math.random() * colorArray.length)]);
    colorsAttr[i] = color.r;
    colorsAttr[i + 1] = color.g;
    colorsAttr[i + 2] = color.b;
  }
  
  ambientParticleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  ambientParticleGeometry.setAttribute('color', new THREE.BufferAttribute(colorsAttr, 3));
  
  const ambientParticleMaterial = new THREE.PointsMaterial({
    size: 0.8,
    vertexColors: true,
    transparent: true,
    opacity: 0.6,
    sizeAttenuation: true
  });
  
  const ambientParticles = new THREE.Points(ambientParticleGeometry, ambientParticleMaterial);
  scene.add(ambientParticles);

  // Connection lines between nearby nodes
  const lines = [];
  
  function updateLines() {
    // Remove old lines
    lines.forEach(line => {
      scene.remove(line);
      line.geometry.dispose();
      line.material.dispose();
    });
    lines.length = 0;
    
    // Create new lines for nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        
        if (distance < 25) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position
          ]);
          
          // Gradient line color based on node colors
          const opacity = Math.max(0, 1 - distance / 25) * 0.3;
          const material = new THREE.LineBasicMaterial({
            color: nodes[i].material.color,
            transparent: true,
            opacity: opacity,
          });
          
          const line = new THREE.Line(geometry, material);
          lines.push(line);
          scene.add(line);
        }
      }
    }
  }

  updateLines();

  // Mouse interaction
  const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  
  function onMouseMove(event) {
    mouse.targetX = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.targetY = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('resize', onResize);

  // Animation loop
  let frameCount = 0;
  const clock = new THREE.Clock();
  
  function animate() {
    requestAnimationFrame(animate);
    frameCount++;
    const time = clock.getElapsedTime();
    
    // Smooth mouse interpolation
    mouse.x += (mouse.targetX - mouse.x) * 0.05;
    mouse.y += (mouse.targetY - mouse.y) * 0.05;
    
    // Animate nodes with organic movement
    nodes.forEach((node, index) => {
      const userData = node.userData;
      
      // Organic floating motion
      node.position.x += Math.sin(time * 0.3 + userData.phase) * 0.015 + userData.velocity.x;
      node.position.y += Math.cos(time * 0.2 + userData.phase) * 0.015 + userData.velocity.y;
      node.position.z += Math.sin(time * 0.25 + userData.phase) * 0.01 + userData.velocity.z;
      
      // Boundary wrapping for endless effect
      ['x', 'y', 'z'].forEach(axis => {
        if (node.position[axis] > 60) node.position[axis] = -60;
        if (node.position[axis] < -60) node.position[axis] = 60;
      });
      
      // Pulsing glow effect
      const pulse = Math.sin(time * userData.pulseSpeed + userData.phase) * 0.3 + 0.7;
      node.material.opacity = pulse * 0.8;
      
      // Rotate nodes slowly
      node.rotation.x += 0.001;
      node.rotation.y += 0.002;
      
      // Color shifting effect
      if (node.children[0]) { // glow element
        node.children[0].material.opacity = pulse * 0.2;
        node.children[0].scale.setScalar(pulse * 1.2);
      }
    });
    
    // Rotate ambient particles
    ambientParticles.rotation.y += 0.0002;
    ambientParticles.rotation.x += 0.0001;
    
    // Pulse ambient particles
    const particlePositions = ambientParticles.geometry.attributes.position.array;
    for (let i = 0; i < particlePositions.length; i += 3) {
      particlePositions[i + 1] += Math.sin(time + i) * 0.005;
    }
    ambientParticles.geometry.attributes.position.needsUpdate = true;
    
    // Update connection lines periodically
    if (frameCount % 15 === 0) {
      updateLines();
    }
    
    // Smooth camera movement following mouse
    camera.position.x += (mouse.x * 8 - camera.position.x) * 0.03;
    camera.position.y += (mouse.y * 8 - camera.position.y) * 0.03;
    
    // Subtle camera rotation
    camera.rotation.z = Math.sin(time * 0.1) * 0.02;
    
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  
  animate();
  
  // Cleanup function
  return () => {
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('resize', onResize);
    
    nodes.forEach(node => {
      node.geometry.dispose();
      node.material.dispose();
      if (node.children[0]) {
        node.children[0].geometry.dispose();
        node.children[0].material.dispose();
      }
    });
    
    lines.forEach(line => {
      line.geometry.dispose();
      line.material.dispose();
    });
    
    ambientParticleGeometry.dispose();
    ambientParticleMaterial.dispose();
    
    renderer.dispose();
    container.removeChild(renderer.domElement);
  };
}
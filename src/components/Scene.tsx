import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { Float, MeshDistortMaterial, Points, PointMaterial, Environment, ContactShadows } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

function FloatingParticles() {
  const points = useMemo(() => {
    const p = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      p[i * 3] = (Math.random() - 0.5) * 20;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.01;
    }
  });

  return (
    <Points ref={pointsRef} positions={points} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.3}
      />
    </Points>
  );
}

function EnergyField() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.getElapsedTime();
      const { mouse } = state;

      // React to mouse proximity
      const dist = Math.sqrt(mouse.x * mouse.x + mouse.y * mouse.y);
      const targetOpacity = 0.02 + dist * 0.12;
      const targetDistort = 0.15 + dist * 0.35;

      materialRef.current.opacity = THREE.MathUtils.lerp(materialRef.current.opacity, targetOpacity, 0.05);
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05);
      
      meshRef.current.rotation.y = time * 0.08;
      meshRef.current.rotation.z = time * 0.04;
    }
  });

  return (
    <mesh ref={meshRef} scale={2.8}>
      <sphereGeometry args={[1, 64, 64]} />
      <MeshDistortMaterial
        ref={materialRef}
        transparent
        color="#8b5cf6"
        speed={2.5}
        distort={0.15}
        radius={1}
        opacity={0.05}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function HeroBurst() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useEffect(() => {
    if (!materialRef.current || !meshRef.current) return;

    // Initial burst animation
    gsap.fromTo(meshRef.current.scale, 
      { x: 0, y: 0, z: 0 },
      { x: 15, y: 15, z: 15, duration: 2, ease: "power4.out" }
    );
    
    gsap.fromTo(materialRef.current,
      { opacity: 0.8 },
      { opacity: 0, duration: 2, ease: "power2.out" }
    );
  }, []);

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshBasicMaterial
        ref={materialRef}
        transparent
        color="#3b82f6"
        opacity={0}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function CameraRig() {
  const { camera, mouse, size } = useThree();
  const basePos = useRef(new THREE.Vector3(0, 0, 7));
  const isMobile = size.width < 768;

  useEffect(() => {
    // Scroll-based camera journey
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    tl.to(basePos.current, {
      z: isMobile ? 4 : 2,
      x: isMobile ? 0 : 1.5,
      y: isMobile ? -0.2 : -0.5,
      ease: "power2.inOut"
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [isMobile]);

  useFrame(() => {
    const targetX = basePos.current.x + mouse.x * (isMobile ? 0.3 : 0.75);
    const targetY = basePos.current.y + mouse.y * (isMobile ? 0.3 : 0.75);
    const targetZ = basePos.current.z;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function CinematicObject() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(null);

  useEffect(() => {
    if (!meshRef.current) return;

    // Scroll-based object animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
      }
    });

    // Object scale and rotation
    tl.to(meshRef.current.scale, {
      x: 1.3,
      y: 1.3,
      z: 1.3,
      ease: "power2.inOut"
    }, 0);

    tl.to(meshRef.current.rotation, {
      y: Math.PI * 4,
      x: Math.PI * 0.75,
      ease: "none"
    }, 0);

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current && materialRef.current) {
      const time = state.clock.getElapsedTime();
      const { mouse } = state;

      // 1. Base Rotation with elegant variation
      meshRef.current.rotation.x += 0.0006 + Math.sin(time * 0.3) * 0.0012;
      meshRef.current.rotation.z += 0.0004 + Math.cos(time * 0.15) * 0.0008;
      
      // 2. Subtle object-level parallax
      const targetRotationX = mouse.y * 0.06;
      const targetRotationY = mouse.x * 0.06;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, meshRef.current.rotation.x + targetRotationX, 0.03);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, meshRef.current.rotation.y + targetRotationY, 0.03);

      // 3. Ultra-subtle Randomized Jitter
      const jitterX = Math.sin(time * 12) * 0.0008 * (1 + Math.abs(mouse.x));
      const jitterY = Math.cos(time * 14) * 0.0008 * (1 + Math.abs(mouse.y));
      meshRef.current.position.x = jitterX;
      meshRef.current.position.y = jitterY;

      // 4. Refined Deformation Patterns
      const targetDistort = 0.3 + (Math.abs(mouse.x) + Math.abs(mouse.y)) * 0.08;
      const targetSpeed = 1.2 + (Math.abs(mouse.x) * 1.2);
      
      // Gentle pulse
      const pulse = Math.sin(time * 1.2) * 0.02;
      
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort + pulse, 0.03);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.03);
    }
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.35, 256, 64]} />
      <MeshDistortMaterial 
        ref={materialRef}
        color="#ffffff" 
        speed={1.2} 
        distort={0.3} 
        radius={1.1}
        roughness={0.05}
        metalness={0.9}
        emissive="#1a0033"
        emissiveIntensity={0.8}
        clearcoat={1}
        clearcoatRoughness={0.1}
      />
    </mesh>
  );
}

export default function Scene() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 7], fov: 75 }} shadows>
        <color attach="background" args={['#050505']} />
        <fog attach="fog" args={['#080810', 4, 12]} />
        
        {/* Environment for realistic reflections and ambient light */}
        <Environment preset="city" />

        {/* Enhanced Cinematic Lighting */}
        <ambientLight intensity={0.15} />
        
        {/* Main Key Light */}
        <directionalLight 
          position={[5, 10, 5]} 
          intensity={2.5} 
          color="#ffffff" 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Secondary Fill Light (Cool Tone) */}
        <pointLight position={[-10, -5, 5]} intensity={1.5} color="#3b82f6" />
        
        {/* Dramatic Rim Light */}
        <spotLight 
          position={[0, 15, -5]} 
          angle={0.3} 
          penumbra={1} 
          intensity={6} 
          color="#ffffff" 
        />
        
        {/* Backlight for depth */}
        <pointLight position={[0, -5, -10]} intensity={3} color="#8b5cf6" />

        <CameraRig />
        <FloatingParticles />
        <HeroBurst />
        
        <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
          <CinematicObject />
          <EnergyField />
        </Float>

        {/* Subtle Ambient Occlusion / Ground Shadow */}
        <ContactShadows
          position={[0, -3.5, 0]}
          opacity={0.4}
          scale={20}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </Canvas>
    </div>
  );
}

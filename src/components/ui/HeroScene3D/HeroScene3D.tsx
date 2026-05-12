import { useRef, memo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Animated floating geometric shape rendered with Three.js.
 * Creates a premium 3D feel in the hero section.
 */
const FloatingGeometry = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} scale={2.2}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#EE4F29"
          roughness={0.3}
          metalness={0.8}
          distort={0.25}
          speed={2}
          transparent
          opacity={0.15}
          wireframe
        />
      </mesh>
      <mesh scale={1.8}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#ff6b3d"
          roughness={0.2}
          metalness={0.9}
          distort={0.3}
          speed={1.5}
          transparent
          opacity={0.08}
        />
      </mesh>
    </Float>
  );
};

const HeroScene3D = memo(({ className = '' }: { className?: string }) => (
  <div
    className={`hero-scene-3d ${className}`}
    style={{
      position: 'absolute',
      top: 0,
      right: 0,
      width: '50%',
      height: '100%',
      pointerEvents: 'none',
      zIndex: 0,
      opacity: 0.7,
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#EE4F29" />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} color="#ff9a76" />
      <pointLight position={[0, 3, 0]} intensity={0.8} color="#EE4F29" />
      <FloatingGeometry />
    </Canvas>
  </div>
));

HeroScene3D.displayName = 'HeroScene3D';

export default HeroScene3D;

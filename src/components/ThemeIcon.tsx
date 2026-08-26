import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function SolarEclipse() {
  const moonRef = useRef<THREE.Mesh>(null);
  const raysGroup = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    if (moonRef.current) {
      const angle = t * 0.6;
      moonRef.current.position.x = Math.cos(angle) * 0.15;
      moonRef.current.position.y = Math.sin(angle) * 0.1;
    }

    if (raysGroup.current) {
      raysGroup.current.rotation.z += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Sun */}
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Sun rays */}
      <group ref={raysGroup}>
        {Array.from({ length: 10 }).map((_, i) => {
          const angle = (i / 10) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 0]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.04, 0.18, 0.04]} />
              <meshStandardMaterial
                color="#fbbf24"
                emissive="#f59e0b"
                emissiveIntensity={0.5}
              />
            </mesh>
          );
        })}
      </group>

      {/* Moon passing in front */}
      <mesh ref={moonRef} position={[0, 0, 0.3]}>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color="#0f1214" />
      </mesh>
    </group>
  );
}

function LunarEclipse() {
  const shadowRef = useRef<THREE.Mesh>(null);
  const moonGroup = useRef<THREE.Group>(null);
  const elapsed = useRef(0);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    if (shadowRef.current) {
      const angle = t * 0.4;
      shadowRef.current.position.x = Math.cos(angle) * 0.18;
      shadowRef.current.position.y = Math.sin(angle) * 0.12;
    }

    if (moonGroup.current) {
      moonGroup.current.rotation.y += delta * 0.08;
    }
  });

  return (
    <group>
      {/* Moon */}
      <group ref={moonGroup}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#94a3b8"
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* Moon craters */}
        <mesh position={[-0.15, 0.1, 0.3]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
        <mesh position={[0.12, -0.08, 0.33]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
        <mesh position={[-0.05, -0.15, 0.35]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      </group>

      {/* Earth's shadow passing over */}
      <mesh ref={shadowRef} position={[0, 0, 0.35]}>
        <sphereGeometry args={[0.34, 32, 32]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#450a0a"
          emissiveIntensity={0.15}
          transparent
          opacity={0.85}
        />
      </mesh>
    </group>
  );
}

export function ThemeIcon({ dark }: { dark: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 2.2], fov: 30 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 2, 4]} intensity={1.0} />
      <pointLight position={[-2, 1, 3]} intensity={0.4} color="#fbbf24" />
      {dark ? <SolarEclipse /> : <LunarEclipse />}
    </Canvas>
  );
}

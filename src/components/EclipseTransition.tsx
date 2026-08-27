import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useCallback } from "react";
import * as THREE from "three";

function SolarEclipseScene({ onDone }: { onDone: () => void }) {
  const moonRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.PointLight>(null);
  const elapsed = useRef(0);
  const doneRef = useRef(false);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    if (moonRef.current) {
      const progress = Math.min(t / 1.8, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      moonRef.current.position.x = THREE.MathUtils.lerp(-2.5, 0, ease);
      moonRef.current.position.y = THREE.MathUtils.lerp(0.8, 0, ease);
    }

    if (coronaRef.current) {
      const progress = Math.min(t / 1.8, 1);
      coronaRef.current.intensity =
        progress > 0.85
          ? THREE.MathUtils.lerp(0, 3, (progress - 0.85) / 0.15)
          : 0;
    }

    if (t > 2.2 && !doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={0.3} />

      {/* Sun */}
      <mesh position={[0, 0, -0.5]}>
        <sphereGeometry args={[0.6, 48, 48]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={1.5}
        />
      </mesh>

      {/* Corona glow */}
      {/* <pointLight
        ref={coronaRef}
        position={[0, 0, 0.5]}
        intensity={0}
        color="#fbbf24"
        distance={8}
      /> */}

      {/* Moon blocking the sun */}
      <mesh ref={moonRef} position={[-2.5, 0.8, 0]}>
        <sphereGeometry args={[0.45, 48, 48]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
    </>
  );
}

function LunarEclipseScene({ onDone }: { onDone: () => void }) {
  const shadowRef = useRef<THREE.Mesh>(null);
  const moonGroup = useRef<THREE.Group>(null);
  const elapsed = useRef(0);
  const doneRef = useRef(false);

  useFrame((_, delta) => {
    elapsed.current += delta;
    const t = elapsed.current;

    if (shadowRef.current) {
      const progress = Math.min(t / 1.8, 1);
      const ease =
        progress < 0.5
          ? 4 * progress * progress * progress
          : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      shadowRef.current.position.x = THREE.MathUtils.lerp(-2.5, 0, ease);
      shadowRef.current.position.y = THREE.MathUtils.lerp(0.6, 0, ease);
    }

    if (moonGroup.current) {
      moonGroup.current.rotation.y += delta * 0.08;
    }

    if (t > 2.2 && !doneRef.current) {
      doneRef.current = true;
      onDone();
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 2, 5]} intensity={0.8} />

      {/* Moon */}
      <group ref={moonGroup}>
        <mesh>
          <sphereGeometry args={[0.35, 48, 48]} />
          <meshStandardMaterial
            color="#cbd5e1"
            emissive="#94a3b8"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[-0.12, 0.09, 0.3]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
        <mesh position={[0.11, -0.07, 0.31]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
        <mesh position={[-0.05, -0.13, 0.32]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshStandardMaterial color="#94a3b8" roughness={1} />
        </mesh>
      </group>

      {/* Earth's shadow */}
      <mesh ref={shadowRef} position={[-2.5, 0.6, 0.3]}>
        <sphereGeometry args={[0.32, 48, 48]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#7f1d1d"
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </>
  );
}

export function EclipseTransition({
  toDark,
  onDone,
}: {
  toDark: boolean;
  onDone: () => void;
}) {
  const handleDone = useCallback(() => onDone(), [onDone]);

  return (
    <div className="fixed inset-0 z-[200] bg-[#020617]">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#020617", 1);
        }}
      >
        {toDark ? (
          <SolarEclipseScene onDone={handleDone} />
        ) : (
          <LunarEclipseScene onDone={handleDone} />
        )}
      </Canvas>
    </div>
  );
}

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const ROAD_LENGTH = 20;
const START_Z = ROAD_LENGTH / 2 - 2;
const END_Z = -ROAD_LENGTH / 2 + 2;

export function GameCar({
  position,
  onReachDestination,
}: {
  position: THREE.Vector3;
  onReachDestination: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const prevZ = useRef(position.z);
  const wheelSpin = useRef(0);

  useFrame(() => {
    if (!group.current) return;

    group.current.position.z = position.z;
    group.current.position.x = Math.sin(position.z * 0.5) * 0.15;

    const nextZ = position.z - 0.1;
    const nextX = Math.sin(nextZ * 0.5) * 0.15;
    const angle = Math.atan2(
      nextX - group.current.position.x,
      nextZ - position.z,
    );
    group.current.rotation.y = angle + Math.PI;

    const dz = position.z - prevZ.current;
    wheelSpin.current += dz * 18;
    prevZ.current = position.z;
    for (const wheel of wheels.current) {
      if (wheel) wheel.rotation.x = wheelSpin.current;
    }

    const distanceToDestination = Math.abs(group.current.position.z - END_Z);
    if (distanceToDestination < 0.5) {
      onReachDestination();
    }
  });

  const setWheel = (index: number) => (node: THREE.Group | null) => {
    if (node) wheels.current[index] = node;
  };

  return (
    <group ref={group} position={[0, 0.12, START_Z]} rotation={[0, Math.PI, 0]}>
      {/* Lower chassis */}
      <mesh position={[0, 0.045, 0]} castShadow>
        <boxGeometry args={[0.46, 0.07, 0.64]} />
        <meshStandardMaterial color="#56686d" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.12, 0]} castShadow>
        <boxGeometry args={[0.42, 0.16, 0.78]} />
        <meshStandardMaterial
          color="#8ebcbc"
          roughness={0.24}
          metalness={0.42}
        />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, 0.085, 0.375]} castShadow>
        <boxGeometry args={[0.34, 0.06, 0.07]} />
        <meshStandardMaterial
          color="#4f6166"
          roughness={0.68}
          metalness={0.08}
        />
      </mesh>
      {/* Rear bumper */}
      <mesh position={[0, 0.085, -0.375]} castShadow>
        <boxGeometry args={[0.34, 0.06, 0.07]} />
        <meshStandardMaterial
          color="#4f6166"
          roughness={0.68}
          metalness={0.08}
        />
      </mesh>
      {/* Side panels */}
      <mesh position={[-0.18, 0.13, 0]}>
        <boxGeometry args={[0.03, 0.12, 0.68]} />
        <meshStandardMaterial
          color="#6f9f9f"
          roughness={0.42}
          metalness={0.18}
        />
      </mesh>
      <mesh position={[0.18, 0.13, 0]}>
        <boxGeometry args={[0.03, 0.12, 0.68]} />
        <meshStandardMaterial
          color="#6f9f9f"
          roughness={0.42}
          metalness={0.18}
        />
      </mesh>
      {/* Cabin */}
      <mesh position={[0, 0.26, -0.04]} castShadow>
        <boxGeometry args={[0.34, 0.15, 0.38]} />
        <meshStandardMaterial
          color="#273038"
          roughness={0.28}
          metalness={0.22}
        />
      </mesh>
      {/* Windows */}
      <mesh position={[0, 0.29, -0.04]}>
        <boxGeometry args={[0.31, 0.085, 0.3]} />
        <meshStandardMaterial
          color="#b9d9e0"
          roughness={0.06}
          metalness={0.72}
          transparent
          opacity={0.88}
        />
      </mesh>
      {/* Cabin roof frame */}
      <mesh position={[0, 0.34, -0.06]}>
        <boxGeometry args={[0.28, 0.03, 0.24]} />
        <meshStandardMaterial
          color="#1d2329"
          roughness={0.4}
          metalness={0.16}
        />
      </mesh>
      {/* Windshield highlight */}
      <mesh position={[0, 0.315, -0.12]} rotation={[0.16, 0, 0]}>
        <boxGeometry args={[0.22, 0.03, 0.11]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
      </mesh>
      {/* Side mirrors */}
      <mesh position={[-0.24, 0.22, -0.08]} rotation={[0, 0, 0.2]}>
        <boxGeometry args={[0.03, 0.02, 0.05]} />
        <meshStandardMaterial
          color="#596c71"
          roughness={0.45}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0.24, 0.22, -0.08]} rotation={[0, 0, -0.2]}>
        <boxGeometry args={[0.03, 0.02, 0.05]} />
        <meshStandardMaterial
          color="#596c71"
          roughness={0.45}
          metalness={0.2}
        />
      </mesh>
      {/* Hood accent */}
      <mesh position={[0, 0.2, 0.28]}>
        <boxGeometry args={[0.38, 0.018, 0.16]} />
        <meshStandardMaterial color="#6d9c9c" roughness={0.3} metalness={0.2} />
      </mesh>
      {/* Grille */}
      <mesh position={[0, 0.14, 0.37]}>
        <boxGeometry args={[0.18, 0.05, 0.02]} />
        <meshStandardMaterial
          color="#12181d"
          roughness={0.85}
          metalness={0.05}
        />
      </mesh>
      {/* Headlights */}
      <mesh position={[-0.13, 0.16, 0.37]}>
        <boxGeometry args={[0.06, 0.04, 0.03]} />
        <meshStandardMaterial
          color="#f8f2c4"
          emissive="#f3e19a"
          emissiveIntensity={0.9}
        />
      </mesh>
      <mesh position={[0.13, 0.16, 0.37]}>
        <boxGeometry args={[0.06, 0.04, 0.03]} />
        <meshStandardMaterial
          color="#f8f2c4"
          emissive="#f3e19a"
          emissiveIntensity={0.9}
        />
      </mesh>
      {/* Taillights */}
      <mesh position={[-0.13, 0.16, -0.38]}>
        <boxGeometry args={[0.055, 0.038, 0.028]} />
        <meshStandardMaterial
          color="#ff7d6e"
          emissive="#ff6a58"
          emissiveIntensity={0.55}
        />
      </mesh>
      <mesh position={[0.13, 0.16, -0.38]}>
        <boxGeometry args={[0.055, 0.038, 0.028]} />
        <meshStandardMaterial
          color="#ff7d6e"
          emissive="#ff6a58"
          emissiveIntensity={0.55}
        />
      </mesh>

      {/* Wheels */}
      {(
        [
          [-0.22, 0.06, 0.24],
          [0.22, 0.06, 0.24],
          [-0.22, 0.06, -0.26],
          [0.22, 0.06, -0.26],
        ] as const
      ).map((pos, index) => (
        <group
          key={index}
          ref={setWheel(index)}
          position={pos}
          rotation={[0, 0, Math.PI / 2]}
        >
          <mesh>
            <cylinderGeometry args={[0.1, 0.1, 0.085, 18]} />
            <meshStandardMaterial color="#101317" roughness={0.88} />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <cylinderGeometry args={[0.055, 0.055, 0.088, 16]} />
            <meshStandardMaterial
              color="#cad5d8"
              roughness={0.3}
              metalness={0.55}
            />
          </mesh>
          <mesh position={[0, 0, 0.03]}>
            <cylinderGeometry args={[0.018, 0.018, 0.09, 12]} />
            <meshStandardMaterial
              color="#717d83"
              roughness={0.45}
              metalness={0.3}
            />
          </mesh>
        </group>
      ))}
      {/* Wheel arches */}
      {(
        [
          [-0.225, 0.11, 0.24],
          [0.225, 0.11, 0.24],
          [-0.225, 0.11, -0.26],
          [0.225, 0.11, -0.26],
        ] as const
      ).map((pos, index) => (
        <mesh key={`arch-${index}`} position={pos}>
          <torusGeometry args={[0.095, 0.015, 8, 16]} />
          <meshStandardMaterial
            color="#48585d"
            roughness={0.8}
            metalness={0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

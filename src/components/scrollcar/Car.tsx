import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { loadGsap } from "../../lib/gsap";
import * as THREE from "three";

const ROAD_LENGTH = 14;
const START_Z = ROAD_LENGTH / 2 - 1.2;
const END_Z = -ROAD_LENGTH / 2 + 1.2;

type ProgressRef = React.MutableRefObject<number>;

export function Car({
  progressRef,
  shouldAnimate,
  isLoader = false,
}: {
  progressRef: ProgressRef;
  shouldAnimate: boolean;
  isLoader?: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Group[]>([]);
  const smoothed = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!group.current) return;

    loadGsap().then((gsap) => {
      if (!group.current) return;

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        gsap.set(group.current.position, { x: 0 });
        gsap.set(group.current.scale, { x: 1, y: 1, z: 1 });
        return;
      }

      if (isLoader) {
        gsap.set(group.current.position, { x: 3, y: 0, z: 0 });
        gsap.set(group.current.scale, { x: 0.5, y: 0.5, z: 0.5 });
        gsap.set(group.current.rotation, { y: Math.PI });

        gsap.to(group.current.position, {
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.5,
        });
        gsap.to(group.current.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.5,
        });
      } else if (shouldAnimate && !hasAnimated.current) {
        hasAnimated.current = true;

        gsap.fromTo(
          group.current.position,
          { x: 5.5 },
          { x: 0, duration: 1.15, ease: "power3.out" },
        );
        gsap.fromTo(
          group.current.scale,
          { x: 1.55, y: 1.55, z: 1.55 },
          {
            x: 1,
            y: 1,
            z: 1,
            duration: 1.15,
            ease: "power3.out",
          },
        );
      } else if (!shouldAnimate && !hasAnimated.current) {
        gsap.set(group.current.position, { x: 5.5 });
        gsap.set(group.current.scale, { x: 1.55, y: 1.55, z: 1.55 });
      }
    });
  }, [shouldAnimate, isLoader]);

  useFrame((_, delta) => {
    if (!group.current) return;

    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 6, delta);

    const z = THREE.MathUtils.lerp(START_Z, END_Z, smoothed.current);
    group.current.position.z = z;

    const spin = smoothed.current * Math.PI * 18;
    for (const wheel of wheels.current) {
      if (wheel) wheel.rotation.x = spin;
    }
  });

  const setWheel = (index: number) => (node: THREE.Group | null) => {
    if (node) wheels.current[index] = node;
  };

  return (
    <group ref={group} position={[0, 0.12, START_Z]} rotation={[0, Math.PI, 0]}>
      {!isLoader && (
        <>
          {/* Ground shadow */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.06, 0]}
            scale={[1.25, 0.7, 1]}
          >
            <circleGeometry args={[0.16, 28]} />
            <meshBasicMaterial color="#101418" transparent opacity={0.18} />
          </mesh>
        </>
      )}

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

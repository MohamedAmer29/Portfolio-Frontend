import { Canvas, useFrame } from "@react-three/fiber";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type MutableRefObject,
} from "react";
import { gsap } from "../lib/gsap";
import * as THREE from "three";
import { useThemeColor } from "../hooks/useThemeColor";

const ROAD_LENGTH = 14;
const START_Z = ROAD_LENGTH / 2 - 1.2;
const END_Z = -ROAD_LENGTH / 2 + 1.2;

type ProgressRef = MutableRefObject<number>;

interface StationConfig {
  id: string;
  name: string;
  color: string;
  activeColor: string;
  emissive: string;
}

const STATION_DEFINITIONS: StationConfig[] = [
  {
    id: "top",
    name: "Top",
    color: "#64748b",
    activeColor: "#38bdf8",
    emissive: "#0284c7",
  },
  {
    id: "about",
    name: "About",
    color: "#64748b",
    activeColor: "#2dd4bf",
    emissive: "#0d9488",
  },
  {
    id: "experience",
    name: "Experience",
    color: "#64748b",
    activeColor: "#fbbf24",
    emissive: "#d97706",
  },
  {
    id: "work",
    name: "Work",
    color: "#64748b",
    activeColor: "#a855f7",
    emissive: "#7e22ce",
  },
  {
    id: "contact",
    name: "Contact",
    color: "#64748b",
    activeColor: "#f43f5e",
    emissive: "#e11d48",
  },
];

function Road({
  stations,
  activeId,
  onSelectStation,
}: {
  stations: (StationConfig & { progress: number; z: number })[];
  activeId: string;
  onSelectStation: (id: string) => void;
}) {
  const dashMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: "#d7e0e0",
        transparent: true,
        opacity: 0.85,
      }),
    [],
  );

  const dashes = useMemo(() => {
    const items: { z: number; key: string }[] = [];
    for (let z = -ROAD_LENGTH / 2 + 0.6; z < ROAD_LENGTH / 2; z += 0.9) {
      items.push({ z, key: `dash-${z}` });
    }
    return items;
  }, []);

  return (
    <group>
      {/* Asphalt */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.02, 0]}
        receiveShadow
      >
        <planeGeometry args={[1.35, ROAD_LENGTH]} />
        <meshStandardMaterial
          color="#2c3338"
          roughness={0.95}
          metalness={0.05}
        />
      </mesh>

      {/* Road edges */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-0.62, -0.01, 0]}>
        <planeGeometry args={[0.06, ROAD_LENGTH]} />
        <meshBasicMaterial color="#8ebaba" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.62, -0.01, 0]}>
        <planeGeometry args={[0.06, ROAD_LENGTH]} />
        <meshBasicMaterial color="#8ebaba" />
      </mesh>

      {/* Center dashes */}
      {dashes.map((dash) => (
        <mesh
          key={dash.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0, dash.z]}
          material={dashMat}
        >
          <planeGeometry args={[0.06, 0.38]} />
        </mesh>
      ))}

      {/* Stop Stations */}
      {stations.map((station) => {
        const isActive = activeId === station.id;
        const mainColor = isActive ? station.activeColor : "#6f8b94";
        const emissiveColor = isActive ? station.emissive : "#3d545c";

        return (
          <group key={station.id} position={[0, 0, station.z]}>
            {/* Station platform line */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
              <planeGeometry args={[1.35, 0.16]} />
              <meshStandardMaterial
                color={mainColor}
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 0.9 : 0.25}
              />
            </mesh>

            {/* Left post & sign indicator */}
            <mesh position={[-0.72, 0.3, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
              <meshStandardMaterial color="#3a4850" roughness={0.5} />
            </mesh>
            <mesh
              position={[-0.72, 0.55, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(station.id);
              }}
            >
              <boxGeometry args={[0.22, 0.22, 0.05]} />
              <meshStandardMaterial
                color={mainColor}
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 1.0 : 0.4}
              />
            </mesh>

            {/* Right post & sign indicator */}
            <mesh position={[0.72, 0.3, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
              <meshStandardMaterial color="#3a4850" roughness={0.5} />
            </mesh>
            <mesh
              position={[0.72, 0.55, 0]}
              onClick={(e) => {
                e.stopPropagation();
                onSelectStation(station.id);
              }}
            >
              <boxGeometry args={[0.22, 0.22, 0.05]} />
              <meshStandardMaterial
                color={mainColor}
                emissive={emissiveColor}
                emissiveIntensity={isActive ? 1.0 : 0.4}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      gsap.set(group.current.position, { x: 0 });
      gsap.set(group.current.scale, { x: 1, y: 1, z: 1 });
      return;
    }

    if (isLoader) {
      // Position car under hexagon for loader with animation
      gsap.set(group.current.position, { x: 3, y: 0, z: 0 });
      gsap.set(group.current.scale, { x: 0.5, y: 0.5, z: 0.5 });
      gsap.set(group.current.rotation, { y: Math.PI });

      // Animate car driving in from right to center
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
    } else {
      // Road mode - animate when shouldAnimate is true
      if (shouldAnimate && !hasAnimated.current) {
        hasAnimated.current = true;

        // Animate from loading position (off-screen right) to road position
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
      }
    }
  }, [shouldAnimate, isLoader]);

  useFrame((_, delta) => {
    if (!group.current) return;

    const target = THREE.MathUtils.clamp(progressRef.current, 0, 1);
    smoothed.current = THREE.MathUtils.damp(smoothed.current, target, 6, delta);

    const z = THREE.MathUtils.lerp(START_Z, END_Z, smoothed.current);
    group.current.position.z = z;

    // Wheel spin based on travel speed
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

function Scene({
  progressRef,
  stations,
  activeId,
  onSelectStation,
  shouldAnimate,
  bgColor,
  groundColor,
}: {
  progressRef: ProgressRef;
  stations: (StationConfig & { progress: number; z: number })[];
  activeId: string;
  onSelectStation: (id: string) => void;
  shouldAnimate: boolean;
  bgColor: string;
  groundColor: string;
}) {
  return (
    <>
      <color attach="background" args={[bgColor]} />
      <ambientLight intensity={0.95} />
      <directionalLight position={[2.5, 6, 3]} intensity={1.35} castShadow />
      <directionalLight position={[-3, 4, -2]} intensity={0.48} />
      <pointLight position={[0, 0.7, 1.05]} intensity={0.95} color="#ffffff" />
      <spotLight
        position={[0, 1.8, 2.2]}
        intensity={0.7}
        angle={0.8}
        penumbra={0.8}
        color="#ffffff"
      />

      <Road
        stations={stations}
        activeId={activeId}
        onSelectStation={onSelectStation}
      />
      <Car progressRef={progressRef} shouldAnimate={shouldAnimate} />

      {/* Soft ground under road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[2.2, ROAD_LENGTH + 1]} />
        <meshBasicMaterial color={groundColor} />
      </mesh>
    </>
  );
}

export function ScrollCar({ shouldAnimate }: { shouldAnimate: boolean }) {
  const progressRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mouseNav, setMouseNav] = useState(false);
  const [activeStationId, setActiveStationId] = useState<string>("top");
  const [stationsWithPos, setStationsWithPos] = useState<
    (StationConfig & { progress: number; z: number })[]
  >([]);
  const bgColor = useThemeColor("--color-bg");
  const groundColor = useThemeColor("--color-bg-elevated");

  const scrollToSection = (id: string) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const updatePositions = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentY = window.scrollY;

      const updated = STATION_DEFINITIONS.map((def) => {
        const el = document.getElementById(def.id);
        let progress = 0;

        if (el && maxScroll > 0) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + currentY;
          progress = THREE.MathUtils.clamp(elementTop / maxScroll, 0, 1);
        } else if (def.id === "contact") {
          progress = 1;
        } else {
          progress = 0;
        }

        const z = THREE.MathUtils.lerp(START_Z, END_Z, progress);
        return { ...def, progress, z };
      });

      setStationsWithPos(updated);

      // Determine active station closest to car position
      const carProgress = maxScroll > 0 ? currentY / maxScroll : 0;
      progressRef.current = carProgress;

      let closestId = "top";
      let minDistance = Infinity;

      for (const st of updated) {
        const dist = Math.abs(st.progress - carProgress);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = st.id;
        }
      }
      setActiveStationId(closestId);
    };

    updatePositions();
    window.addEventListener("scroll", updatePositions, { passive: true });
    window.addEventListener("resize", updatePositions);
    return () => {
      window.removeEventListener("scroll", updatePositions);
      window.removeEventListener("resize", updatePositions);
    };
  }, []);

  const updateFromPointer = (clientY: number) => {
    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;
    const local = (clientY - rect.top) / rect.height;
    progressRef.current = THREE.MathUtils.clamp(local, 0, 1);
  };

  const scrollToPointer = (clientY: number) => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return;

    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    const local = THREE.MathUtils.clamp(
      (clientY - rect.top) / rect.height,
      0,
      1,
    );
    window.scrollTo({ top: local * max, behavior: "smooth" });
    progressRef.current = local;
  };

  return (
    <aside className="pointer-events-none fixed bottom-0 left-0 top-[70px] md:top-20 z-30 hidden w-[95px] lg:block">
      <div
        ref={panelRef}
        className="pointer-events-auto relative h-full w-full border-r border-ink/10 bg-gradient-to-b from-bg/92 via-bg/86 to-bg/94 backdrop-blur-sm shadow-[1px_0_0_rgba(26,31,36,0.02)]"
        onPointerMove={(event) => {
          if (!mouseNav) return;
          updateFromPointer(event.clientY);
        }}
        onPointerEnter={(event) => {
          if (!mouseNav) return;
          updateFromPointer(event.clientY);
        }}
        onClick={(event) => {
          updateFromPointer(event.clientY);
          scrollToPointer(event.clientY);
          setMouseNav((current) => !current);
        }}
        role="button"
        tabIndex={0}
        aria-label="Scroll car navigation rail"
      >
        <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center">
          <div className="h-20 w-[1px] bg-gradient-to-b from-transparent via-ink/18 to-transparent" />
        </div>

        {/* HTML Stop Station Badges Overlay */}
        <div className="pointer-events-auto absolute inset-0 z-10">
          {stationsWithPos.map((station) => {
            const isActive = activeStationId === station.id;
            const topPercent = 95 - station.progress * 90;

            return (
              <button
                key={station.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  scrollToSection(station.id);
                }}
                style={{
                  top: `${topPercent}%`,
                  borderColor: isActive
                    ? station.activeColor
                    : "rgba(142,186,186,0.3)",
                  backgroundColor: isActive
                    ? station.activeColor
                    : "rgba(44,51,56,0.88)",
                  color: isActive ? "#0f172a" : "#8ebaba",
                  boxShadow: isActive
                    ? `0 0 12px ${station.activeColor}bb`
                    : "none",
                }}
                className={`absolute right-1 -translate-y-1/2 rounded-md px-1.5 py-0.5 font-mono text-[10px] font-bold border transition-all duration-300 hover:scale-110 cursor-pointer ${
                  isActive
                    ? "scale-105"
                    : "hover:bg-[#8ebaba] hover:text-[#1a1f24]"
                }`}
                title={`Go to ${station.name} section`}
              >
                {station.name}
              </button>
            );
          })}
        </div>

        <Canvas
          orthographic
          camera={{ position: [0, 8.5, 0], zoom: 38, near: 0.1, far: 40 }}
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true }}
          onCreated={({ camera, gl }) => {
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
            gl.setClearColor(bgColor, 1);
          }}
          className="!h-full !w-full"
        >
          <Scene
            progressRef={progressRef}
            stations={stationsWithPos}
            activeId={activeStationId}
            onSelectStation={(id) => scrollToSection(id)}
            shouldAnimate={shouldAnimate}
            bgColor={bgColor}
            groundColor={groundColor}
          />
        </Canvas>
      </div>
      <span className="sr-only">
        Scroll progress indicated by car on road with station stops. Click any
        station or rail to navigate.
      </span>
    </aside>
  );
}

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PageLoader } from "./PageLoader";
import { useThemeColor } from "../hooks/useThemeColor";
import { useDarkMode } from "../hooks/useDarkMode";

const ROAD_LENGTH = 20;
const START_Z = ROAD_LENGTH / 2 - 2;
const END_Z = -ROAD_LENGTH / 2 + 2;
const ROAD_WIDTH = 2;

function Road() {
  const dashMat = new THREE.MeshBasicMaterial({
    color: "#d7e0e0",
    transparent: true,
    opacity: 0.85,
  });

  const dashes = [];
  for (let z = -ROAD_LENGTH / 2 + 0.6; z < ROAD_LENGTH / 2; z += 0.9) {
    // Add curve to dashes - more curvy
    const curveOffset = Math.sin(z * 0.5) * 0.15;
    dashes.push({ z, x: curveOffset, key: `dash-${z}` });
  }

  // Create curved road segments - more curvy
  const roadSegments = [];
  for (let z = -ROAD_LENGTH / 2; z < ROAD_LENGTH / 2; z += 1) {
    const curveOffset = Math.sin(z * 0.5) * 0.15;
    roadSegments.push({ z, x: curveOffset, key: `segment-${z}` });
  }

  return (
    <group>
      {/* Curved Asphalt */}
      {roadSegments.map((segment) => (
        <mesh
          key={segment.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[segment.x, -0.02, segment.z]}
          receiveShadow
        >
          <planeGeometry args={[ROAD_WIDTH, 1.1]} />
          <meshStandardMaterial
            color="#2c3338"
            roughness={0.95}
            metalness={0.05}
          />
        </mesh>
      ))}

      {/* Road edges - curved */}
      {roadSegments.map((segment) => (
        <>
          <mesh
            key={`left-edge-${segment.key}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[segment.x - ROAD_WIDTH / 2, -0.01, segment.z]}
          >
            <planeGeometry args={[0.08, 1.1]} />
            <meshBasicMaterial color="#8ebaba" />
          </mesh>
          <mesh
            key={`right-edge-${segment.key}`}
            rotation={[-Math.PI / 2, 0, 0]}
            position={[segment.x + ROAD_WIDTH / 2, -0.01, segment.z]}
          >
            <planeGeometry args={[0.08, 1.1]} />
            <meshBasicMaterial color="#8ebaba" />
          </mesh>
        </>
      ))}

      {/* Center dashes - curved */}
      {dashes.map((dash) => (
        <mesh
          key={dash.key}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[dash.x, 0, dash.z]}
          material={dashMat}
        >
          <planeGeometry args={[0.08, 0.38]} />
        </mesh>
      ))}

      {/* Portfolio destination line */}
      <group position={[Math.sin(END_Z * 0.5) * 0.6, 0, END_Z]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
          <planeGeometry args={[ROAD_WIDTH, 0.16]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={0.9}
          />
        </mesh>
        <mesh position={[-ROAD_WIDTH / 2 - 0.1, 0.3, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
          <meshStandardMaterial color="#3a4850" roughness={0.5} />
        </mesh>
        <mesh position={[-ROAD_WIDTH / 2 - 0.1, 0.55, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={1.0}
          />
        </mesh>
        <mesh position={[ROAD_WIDTH / 2 + 0.1, 0.3, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 12]} />
          <meshStandardMaterial color="#3a4850" roughness={0.5} />
        </mesh>
        <mesh position={[ROAD_WIDTH / 2 + 0.1, 0.55, 0]}>
          <boxGeometry args={[0.22, 0.22, 0.05]} />
          <meshStandardMaterial
            color="#a855f7"
            emissive="#7e22ce"
            emissiveIntensity={1.0}
          />
        </mesh>
        {/* PORTFOLIO Sign */}
        <group position={[0, 0.8, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.35, 0.08]} />
            <meshStandardMaterial
              color="#a855f7"
              emissive="#7e22ce"
              emissiveIntensity={1.0}
            />
          </mesh>
          <mesh position={[0, 0.15, 0.05]}>
            <boxGeometry args={[1.0, 0.25, 0.02]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>
    </group>
  );
}

function GameCar({
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

    // Update position from prop with curve - more curvy
    group.current.position.z = position.z;
    group.current.position.x = Math.sin(position.z * 0.5) * 0.6;

    // Rotate car to follow the curve - more curvy
    const nextZ = position.z - 0.1;
    const nextX = Math.sin(nextZ * 0.5) * 0.6;
    const angle = Math.atan2(
      nextX - group.current.position.x,
      nextZ - position.z,
    );
    group.current.rotation.y = angle + Math.PI;

    // Wheel spin based on travel
    const dz = position.z - prevZ.current;
    wheelSpin.current += dz * 18;
    prevZ.current = position.z;
    for (const wheel of wheels.current) {
      if (wheel) wheel.rotation.x = wheelSpin.current;
    }

    // Check if car reached destination
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

function GameScene({
  carPosition,
  gameStarted,
  keysPressed,
  onReachDestination,
  bgColor,
  groundColor,
}: {
  carPosition: THREE.Vector3;
  gameStarted: boolean;
  keysPressed: React.MutableRefObject<Set<string>>;
  onReachDestination: () => void;
  bgColor: string;
  groundColor: string;
}) {
  useFrame((_, delta) => {
    if (!gameStarted) return;

    const speed = 8 * delta;
    const car = carPosition;

    if (
      keysPressed.current.has("ArrowUp") ||
      keysPressed.current.has("w") ||
      keysPressed.current.has("W")
    ) {
      car.z = Math.max(car.z - speed, END_Z);
    }
  });

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

      <Road />
      <GameCar position={carPosition} onReachDestination={onReachDestination} />

      {/* Soft ground under road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.04, 0]}>
        <planeGeometry args={[4, ROAD_LENGTH + 1]} />
        <meshBasicMaterial color={groundColor} />
      </mesh>
    </>
  );
}

export function MiniGame({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const carPositionRef = useRef(new THREE.Vector3(0, 0.12, START_Z));
  const keysPressed = useRef<Set<string>>(new Set());
  const [loadingDone, setLoadingDone] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [finished, setFinished] = useState(false);
  const startCarAudioRef = useRef<HTMLAudioElement | null>(null);
  const carHonkAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameStartedRef = useRef(false);
  const finishedRef = useRef(false);
  const bgColor = useThemeColor("--color-bg");
  const groundColor = useThemeColor("--color-bg-elevated");
  const [dark, setDark] = useDarkMode();

  const playSound = (
    ref: React.MutableRefObject<HTMLAudioElement | null>,
    src: string,
  ) => {
    if (!ref.current) {
      ref.current = new Audio(src);
    }
    ref.current.currentTime = 0;
    ref.current.play().catch(() => {});
  };

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    document.documentElement.style.scrollbarWidth = "none";
    document.body.style.overflow = "hidden";
    document.body.classList.remove("has-custom-cursor");

    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key);

      const isForward = e.key === "ArrowUp" || e.key === "w" || e.key === "W";
      const isHonk = e.key === " ";

      if (isForward && gameStartedRef.current) {
        playSound(startCarAudioRef, "/sounds/start_car.mp3");
      }

      if (isHonk && gameStartedRef.current) {
        playSound(carHonkAudioRef, "/sounds/car-honk.mp3");
      }

      if (e.key === " " || e.key === "Enter") {
        setShowInstructions(false);
        setGameStarted(true);
        gameStartedRef.current = true;
      }
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      document.documentElement.style.overflow = "";
      document.documentElement.style.scrollbarWidth = "";
      document.body.style.overflow = "";
      document.body.classList.add("has-custom-cursor");
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (startCarAudioRef.current) {
        startCarAudioRef.current.pause();
        startCarAudioRef.current = null;
      }
      if (carHonkAudioRef.current) {
        carHonkAudioRef.current.pause();
        carHonkAudioRef.current = null;
      }
    };
  }, []);

  const handleTouchStart = () => {
    setShowInstructions(false);
    setGameStarted(true);
    gameStartedRef.current = true;
  };

  const handleForwardStart = () => {
    if (!gameStartedRef.current) {
      setShowInstructions(false);
      setGameStarted(true);
      gameStartedRef.current = true;
    }
    keysPressed.current.add("ArrowUp");
    playSound(startCarAudioRef, "/sounds/start_car.mp3");
  };

  const handleForwardEnd = () => {
    keysPressed.current.delete("ArrowUp");
  };

  const handleHonk = () => {
    playSound(carHonkAudioRef, "/sounds/car-honk.mp3");
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      handleForwardStart();
    } else if (e.button === 2) {
      handleHonk();
    }
  };

  const handleCanvasMouseUp = (e: React.MouseEvent) => {
    if (e.button === 0) {
      handleForwardEnd();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleReachDestination = () => {
    if (finishedRef.current) return;
    if (gameStarted) {
      finishedRef.current = true;
      setFinished(true);
      setTimeout(() => onComplete(), 1200);
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10001] flex h-dvh w-screen max-w-[100vw] overflow-hidden bg-bg"
      aria-hidden="true"
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Mini Game</span>

      {!loadingDone && (
        <PageLoader letter="M" onComplete={() => setLoadingDone(true)} />
      )}

      {showInstructions && loadingDone && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/90 z-10">
          <div className="text-center px-4">
            <h2 className="text-3xl font-bold text-ink mb-4">
              Drive to Portfolio
            </h2>
            <p className="text-ink/70 mb-2">
              Use Arrow Up or W to move the car
            </p>
            <p className="text-ink/70 mb-2">Or hold click / tap to drive</p>
            <p className="text-ink/70 mb-2">Right-click / SPACE to honk</p>
            <p className="text-ink/50 text-sm mb-6">
              Press SPACE or ENTER to start
            </p>
            <button
              type="button"
              onClick={onComplete}
              className="px-5 py-2 text-sm font-mono text-ink/50 border border-ink/15 rounded-md hover:bg-ink/5 hover:text-ink/70 transition-colors cursor-pointer"
            >
              Skip →
            </button>
          </div>
        </div>
      )}

      {finished && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg/80 backdrop-blur-sm z-10 animate-fade-in">
          <div className="text-center">
            <p className="text-sm font-mono text-accent tracking-widest uppercase mb-2">
              Welcome
            </p>
            <h2 className="text-4xl font-bold text-ink">
              You made it!
            </h2>
          </div>
        </div>
      )}

      {/* Left description panel - desktop only */}
      <div className="hidden md:flex h-full w-5/12 flex-col justify-center bg-bg border-r border-ink/10 px-12 lg:px-16 relative">
        {/* Pointer arrow toward game */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-ink/20"
          >
            <path
              d="M9 18l6-6-6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="max-w-lg">
          <p className="text-sm font-mono text-ink/40 tracking-widest uppercase mb-3">
            Welcome
          </p>
          <h1 className="text-4xl lg:text-5xl font-bold text-ink leading-tight mb-4">
            Mohamed Amer
          </h1>
          <p className="text-lg text-ink/60 mb-6">
            I build things for the web.
          </p>
          <p className="text-ink/50 leading-relaxed mb-6">
            I'm a Full Stack Engineer with a strong foundation in front-end &
            back-end development. I focus on building accessible, performant
            products and digital experiences that people enjoy using.
          </p>
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              "React",
              "TypeScript",
              "Next.js",
              "Node.js",
              "NestJS",
              "PostgreSQL",
              "MongoDB",
              "Prisma",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono text-ink/50 border border-ink/15 rounded-md"
              >
                {tech}
              </span>
            ))}
          </div>
          <p className="text-sm text-ink/30 mb-6">
            Drive the car to the finish line to enter the portfolio.
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onComplete}
              className="px-5 py-2 text-sm font-mono text-ink/50 border border-ink/15 rounded-md hover:bg-ink/5 hover:text-ink/70 transition-colors cursor-pointer"
            >
              Skip →
            </button>
            <button
              type="button"
              onClick={() => setDark((d) => !d)}
              className="grid size-9 place-items-center rounded border border-ink/30 text-ink-muted transition-all duration-300 hover:border-accent hover:text-accent cursor-pointer"
              aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Game canvas */}
      <div
        className="relative flex flex-col items-center h-full w-full md:w-7/12 cursor-pointer select-none"
        onTouchStart={handleTouchStart}
        onMouseDown={handleCanvasMouseDown}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleForwardEnd}
        onContextMenu={handleContextMenu}
      >
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
          <GameScene
            carPosition={carPositionRef.current}
            gameStarted={gameStarted}
            keysPressed={keysPressed}
            onReachDestination={handleReachDestination}
            bgColor={bgColor}
            groundColor={groundColor}
          />
        </Canvas>

        {/* Mobile skip button */}
        <button
          type="button"
          onClick={onComplete}
          className="absolute top-4 right-4 z-20 md:hidden px-4 py-1.5 text-xs font-mono text-ink/40 border border-ink/15 rounded-md bg-bg/80 backdrop-blur-sm active:bg-ink/10 cursor-pointer"
        >
          Skip →
        </button>

        {/* Mobile on-screen controls */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 md:hidden">
          <button
            type="button"
            onPointerDown={handleForwardStart}
            onPointerUp={handleForwardEnd}
            onPointerLeave={handleForwardEnd}
            className="size-16 rounded-full border-2 border-ink/20 bg-bg/70 backdrop-blur-sm flex items-center justify-center active:border-accent active:bg-accent/20 transition-colors cursor-pointer"
            aria-label="Drive forward"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/50">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onPointerDown={handleHonk}
            className="size-14 rounded-full border-2 border-ink/20 bg-bg/70 backdrop-blur-sm flex items-center justify-center active:border-accent active:bg-accent/20 transition-colors cursor-pointer"
            aria-label="Honk"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ink/50">
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

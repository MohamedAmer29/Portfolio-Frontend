import { useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { GameScene } from "./GameScene";

const ROAD_LENGTH = 20;
const START_Z = ROAD_LENGTH / 2 - 2;

export function MiniGame({ onComplete }: { onComplete: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const carPositionRef = useRef(new THREE.Vector3(0, 0.12, START_Z));
  const keysPressed = useRef<Set<string>>(new Set());
  const [, setLoading] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const startCarAudioRef = useRef<HTMLAudioElement | null>(null);
  const carHonkAudioRef = useRef<HTMLAudioElement | null>(null);
  const gameStartedRef = useRef(false);

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
    document.body.style.overflow = "hidden";

    const loadingTimer = setTimeout(() => setLoading(false), 1800);

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
      clearTimeout(loadingTimer);
      document.body.style.overflow = "";
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
    if (gameStarted) {
      onComplete();
    }
  };

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10001] flex h-dvh  max-w-[100vw] overflow-hidden bg-bg"
      aria-hidden="true"
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Mini Game</span>

      {showInstructions && (
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

      {/* Left description panel - desktop only */}
      <div className="hidden md:flex h-full w-5/12 overflow-hidden overflow-x-hidden flex-col justify-center bg-bg border-r border-ink/10 px-12 lg:px-16 overflow-y-auto relative">
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

        <div className="max-w-lg ">
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
          <button
            type="button"
            onClick={onComplete}
            className="px-5 py-2 text-sm font-mono text-ink/50 border border-ink/15 rounded-md hover:bg-ink/5 hover:text-ink/70 transition-colors cursor-pointer"
          >
            Skip →
          </button>
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
            gl.setClearColor("#e2e8e8", 1);
          }}
          className="!h-full !w-full"
        >
          <GameScene
            carPosition={carPositionRef.current}
            gameStarted={gameStarted}
            keysPressed={keysPressed}
            onReachDestination={handleReachDestination}
          />
        </Canvas>

        {/* Mobile on-screen controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6 pointer-events-none  z-20 md:hidden">
          <button
            type="button"
            onTouchStart={handleForwardStart}
            onTouchEnd={handleForwardEnd}
            onMouseDown={handleForwardStart}
            onMouseUp={handleForwardEnd}
            onMouseLeave={handleForwardEnd}
            className="pointer-events-auto w-20 h-20 rounded-full bg-ink/20 border-2 border-ink/30 flex items-center justify-center active:bg-ink/40 select-none "
            aria-label="Move forward"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink/70 "
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={handleHonk}
            className="pointer-events-auto w-20 h-20 rounded-full bg-ink/20 border-2 border-ink/30 flex items-center justify-center active:bg-ink/40 select-none "
            aria-label="Honk"
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-ink/70"
            >
              <path d="M11 5L6 9H2v6h4l5 4V5z" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          </button>
        </div>

        {/* Mobile skip button */}
        <button
          type="button"
          onClick={onComplete}
          className="absolute top-4 right-4 z-20  px-4 py-1.5 text-xs font-mono text-ink/40 border border-ink/15 rounded-md bg-bg/80 backdrop-blur-sm active:bg-ink/10 cursor-pointer md:hidden"
        >
          Skip →
        </button>
      </div>
    </div>
  );
}

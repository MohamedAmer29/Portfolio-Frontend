import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import * as THREE from "three";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Scene } from "./Scene";

const roadRailVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      delay: 0.95,
      ease: "easeOut",
    },
  },
};

const ROAD_LENGTH = 16.2;
const START_Z = ROAD_LENGTH / 2 - 1.2;
const END_Z = -ROAD_LENGTH / 2 + 1.2;

interface StationConfig {
  id: string;
  name: string;
  color: string;
  activeColor: string;
  emissive: string;
}

const STATION_DEFINITIONS: StationConfig[] = [
  {
    id: "about",
    name: "About",
    color: "#64748b",
    activeColor: "#2dd4bf",
    emissive: "#0d9488",
  },
  {
    id: "skills",
    name: "Skills",
    color: "#64748b",
    activeColor: "#7fadad",
    emissive: "#5a8a8a",
  },
  {
    id: "education",
    name: "Education",
    color: "#64748b",
    activeColor: "#60a5fa",
    emissive: "#2563eb",
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
    id: "services",
    name: "Services",
    color: "#64748b",
    activeColor: "#67c3c3",
    emissive: "#456e6e",
  },
  {
    id: "contact",
    name: "Contact",
    color: "#64748b",
    activeColor: "#f43f5e",
    emissive: "#e11d48",
  },
];

export function ScrollCar({ shouldAnimate }: { shouldAnimate: boolean }) {
  const progressRef = useRef(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const carHonkAudioRef = useRef<HTMLAudioElement | null>(null);
  const carCrashAudioRef = useRef<HTMLAudioElement | null>(null);
  const previousActiveRef = useRef<string | null>(null);
  const arrivalCountRef = useRef(0);
  const [mouseNav, setMouseNav] = useState(false);
  const [activeStationId, setActiveStationId] = useState<string>(
    STATION_DEFINITIONS[0]?.id ?? "about",
  );
  const [stationsWithPos, setStationsWithPos] = useState<
    (StationConfig & { progress: number; z: number })[]
  >([]);
  const bgColor = useThemeColor("--color-bg");
  const groundColor = useThemeColor("--color-bg-elevated");

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

  const scrollToSection = (id: string) => {
    const targetElement = document.getElementById(id);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    let rafId = 0;

    const updatePositions = () => {
      let maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const currentY = window.scrollY;

      const updated = STATION_DEFINITIONS.map((def) => {
        const el = document.getElementById(def.id);
        let progress = 0;

        if (el && maxScroll > 0) {
          const rect = el.getBoundingClientRect();
          const elementTop = rect.top + currentY;
          // Anchor the station to the section's center so the car sits at the
          // stop while that section is in view, not only when its top hits the
          // top of the viewport.
          const elementCenter = elementTop + rect.height / 2;
          progress = THREE.MathUtils.clamp(
            (elementCenter - window.innerHeight / 2) / maxScroll,
            0,
            1,
          );
        }

        if (def.id === "contact") {
          // Contact is the final destination — pin it to the end of the road
          // so the car arrives exactly at the last station instead of
          // overshooting it into the footer.
          progress = 1;
        } else if (!el) {
          progress = 0;
        }

        const z = THREE.MathUtils.lerp(START_Z, END_Z, progress);
        return { ...def, progress, z };
      });

      setStationsWithPos(updated);

      const carProgress = maxScroll > 0 ? currentY / maxScroll : 0;
      progressRef.current = carProgress;

      let closestId = STATION_DEFINITIONS[0]?.id ?? "";
      let minDistance = Infinity;

      for (const st of updated) {
        const dist = Math.abs(st.progress - carProgress);
        if (dist < minDistance) {
          minDistance = dist;
          closestId = st.id;
        }
      }
      setActiveStationId(closestId);

      const previousActive = previousActiveRef.current;
      previousActiveRef.current = closestId;
      if (closestId === "contact" && previousActive !== "contact") {
        if (arrivalCountRef.current < 2) {
          arrivalCountRef.current += 1;
          playSound(carHonkAudioRef, "/sounds/car-honk.mp3");
        } else if (arrivalCountRef.current === 2) {
          arrivalCountRef.current += 1;
          playSound(carCrashAudioRef, "/sounds/car_crash.mp3");
        }
      }
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updatePositions);
    };

    updatePositions();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (carHonkAudioRef.current) {
        carHonkAudioRef.current.pause();
        carHonkAudioRef.current = null;
      }
      if (carCrashAudioRef.current) {
        carCrashAudioRef.current.pause();
        carCrashAudioRef.current = null;
      }
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
    <motion.aside
      variants={roadRailVariants}
      initial="hidden"
      animate="show"
      className="pointer-events-none fixed bottom-0 left-0 top-[70px] md:top-20 z-30 hidden w-[95px] lg:block"
    >
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
    </motion.aside>
  );
}

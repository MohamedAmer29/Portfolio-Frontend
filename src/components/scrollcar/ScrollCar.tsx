import { Canvas } from "@react-three/fiber";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useThemeColor } from "../../hooks/useThemeColor";
import { Scene } from "./Scene";

const ROAD_LENGTH = 14;
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

        const stationOffsets: Record<string, number> = {
          top: 0,
          about: 0.05,
          skills: 0.08,
          education: 0,
          experience: 0,
          work: 0,
          contact: 0,
        };

        const offset = stationOffsets[def.id] || 0;
        progress = THREE.MathUtils.clamp(progress + offset, 0, 1);

        const z = THREE.MathUtils.lerp(START_Z, END_Z, progress);
        return { ...def, progress, z };
      });

      setStationsWithPos(updated);

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

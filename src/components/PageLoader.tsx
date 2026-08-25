import { useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { gsap, useGSAP } from "../lib/gsap";
import { Car } from "./ScrollCar";
import { useThemeColor } from "../hooks/useThemeColor";

type PageLoaderProps = {
  letter: string;
  onComplete: () => void;
};

/**
 * Full-screen intro loader inspired by Brittany Chiang's hexagon draw sequence:
 * 1) Hex stroke draws in
 * 2) Letter fades in
 * 3) Logo scales down + fades
 * 4) Overlay fades out → main app
 */
export function PageLoader({ letter, onComplete }: PageLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<SVGPathElement>(null);
  const letterRef = useRef<SVGTextElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const completedRef = useRef(false);
  const bgColor = useThemeColor("--color-bg");
  const groundColor = useThemeColor("--color-bg-elevated");
  const progressRef = useRef(0);

  const finish = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    document.body.style.overflow = "";
    onComplete();
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useGSAP(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const hex = hexRef.current;
    const mark = letterRef.current;
    if (!root || !logo || !hex || !mark) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      gsap.set(hex, { strokeDashoffset: 0 });
      gsap.set(mark, { opacity: 1 });
      gsap.to(root, {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: finish,
      });
      return;
    }

    const length = hex.getTotalLength();
    gsap.set(hex, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });
    gsap.set(mark, { opacity: 0 });
    gsap.set(logo, { opacity: 1, scale: 1, transformOrigin: "50% 50%" });
    gsap.set(root, { autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: finish,
    });

    // Match Brittany Chiang timing (animejs → GSAP):
    // path draw: delay 300, duration 1500, easeInOutQuart
    // letter: duration 700
    // logo shrink: delay 500, duration 300, scale 0.1, opacity 0
    // overlay fade: duration 200
    tl.to(hex, {
      strokeDashoffset: 0,
      duration: 1.5,
      delay: 0.3,
      ease: "power4.inOut",
    })
      .to(mark, {
        opacity: 1,
        duration: 0.7,
        ease: "power4.inOut",
      })
      .to(logo, {
        opacity: 0,
        scale: 0.1,
        duration: 0.3,
        delay: 0.5,
        ease: "power4.inOut",
      })
      .to(root, {
        autoAlpha: 0,
        duration: 0.2,
        ease: "power4.inOut",
        pointerEvents: "none",
      });
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[10000] flex h-dvh w-screen max-w-[100vw] items-center justify-center overflow-hidden bg-bg"
      aria-hidden="true"
      aria-busy="true"
      role="status"
    >
      <span className="sr-only">Loading</span>

      <div className="relative flex flex-col items-center">
        <div className="w-[min(22vw,100px)] max-w-[100px] min-w-[72px]">
          <svg
            ref={logoRef}
            id="page-loader-logo"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="block size-full select-none text-ink"
            aria-hidden="true"
          >
            <title>Logo</title>
            <path
              ref={hexRef}
              d="M50 5 L88.5 27.5 L88.5 72.5 L50 95 L11.5 72.5 L11.5 27.5 Z"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <text
              ref={letterRef}
              x="50"
              y="64"
              textAnchor="middle"
              fill="currentColor"
              fontFamily="Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif"
              fontSize="40"
              fontWeight="700"
              opacity="0"
            >
              {letter}
            </text>
          </svg>
        </div>

        <div className="h-[200px] w-[250px]">
          <Canvas
            orthographic
            camera={{ position: [0, 0, 8], zoom: 55, near: 0.1, far: 40 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true }}
            onCreated={({ camera, gl }) => {
              camera.lookAt(0, 0, 0);
              camera.updateProjectionMatrix();
              gl.setClearColor(bgColor, 0);
            }}
            className="!h-full !w-full"
          >
            <color attach="background" args={[bgColor]} />
            <ambientLight intensity={0.95} />
            <directionalLight position={[2.5, 6, 3]} intensity={1.35} />
            <directionalLight position={[-3, 4, -2]} intensity={0.48} />
            <pointLight
              position={[0, 0.7, 1.05]}
              intensity={0.95}
              color="#ffffff"
            />
            <Car
              progressRef={progressRef}
              shouldAnimate={false}
              isLoader={true}
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
}

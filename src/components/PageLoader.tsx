import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "../lib/gsap";

type PageLoaderProps = {
  letter: string;
  onComplete: () => void;
};

export function PageLoader({ letter, onComplete }: PageLoaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<SVGPathElement>(null);
  const letterRef = useRef<SVGTextElement>(null);
  const logoRef = useRef<SVGSVGElement>(null);
  const carRef = useRef<HTMLDivElement>(null);
  const completedRef = useRef(false);

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
    const car = carRef.current;
    if (!root || !logo || !hex || !mark || !car) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced) {
      gsap.set(hex, { strokeDashoffset: 0 });
      gsap.set(mark, { opacity: 1 });
      gsap.set(car, { x: -40, opacity: 1 });
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
    gsap.set(car, { x: -60, opacity: 0 });
    gsap.set(root, { autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: finish,
    });

    tl.to(hex, {
      strokeDashoffset: 0,
      duration: 1.5,
      delay: 0.3,
      ease: "power4.inOut",
    })
      .to(
        mark,
        {
          opacity: 1,
          duration: 0.7,
          ease: "power4.inOut",
        },
        "-=0.8",
      )
      .to(
        car,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=1",
      )
      .to(logo, {
        opacity: 0,
        scale: 0.1,
        duration: 0.3,
        delay: 0.3,
        ease: "power4.inOut",
      })
      .to(
        car,
        {
          x: 60,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in",
        },
        "-=0.1",
      )
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

      <div className="relative flex flex-col items-center gap-6">
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

        <div
          ref={carRef}
          className="h-8 w-[250px] opacity-0"
        >
          <svg
            viewBox="0 0 120 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full text-ink-muted"
          >
            {/* Car body */}
            <rect x="20" y="14" width="80" height="16" rx="4" fill="currentColor" opacity="0.8" />
            {/* Roof */}
            <path d="M35 14 L45 4 L75 4 L85 14" fill="currentColor" opacity="0.6" />
            {/* Windows */}
            <path d="M47 5.5 L57 5.5 L57 13 L38 13 Z" fill="currentColor" opacity="0.3" />
            <path d="M63 5.5 L73 5.5 L82 13 L63 13 Z" fill="currentColor" opacity="0.3" />
            {/* Headlights */}
            <rect x="96" y="17" width="6" height="4" rx="1" fill="currentColor" opacity="0.5" />
            <rect x="96" y="24" width="6" height="3" rx="1" fill="currentColor" opacity="0.3" />
            {/* Wheels */}
            <circle cx="38" cy="32" r="5" fill="currentColor" opacity="0.9" />
            <circle cx="38" cy="32" r="2.5" fill="currentColor" opacity="0.4" />
            <circle cx="82" cy="32" r="5" fill="currentColor" opacity="0.9" />
            <circle cx="82" cy="32" r="2.5" fill="currentColor" opacity="0.4" />
            {/* Ground line */}
            <line x1="10" y1="37" x2="110" y2="37" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          </svg>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useRef } from "react";
import { useGSAP } from "../../lib/gsap";
import { LogoMark } from "../LogoMark";

declare const gsap: typeof import("gsap").gsap;

type SiteEntranceProps = {
  letter: string;
  logoAnchorRef: React.RefObject<HTMLElement | null>;
  onComplete: () => void;
};

export function SiteEntrance({
  letter,
  logoAnchorRef,
  onComplete,
}: SiteEntranceProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const flyingLogoRef = useRef<HTMLDivElement>(null);
  const hexRef = useRef<SVGPathElement>(null);
  const letterRef = useRef<SVGTextElement>(null);
  const completedRef = useRef(false);
  const flyTargetRef = useRef({ x: 0, y: 0, scale: 1 });

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useGSAP(() => {
    const overlay = overlayRef.current;
    const flyingLogo = flyingLogoRef.current;
    const hex = hexRef.current;
    const mark = letterRef.current;

    if (!overlay || !flyingLogo || !hex || !mark) return;

    const finish = () => {
      if (completedRef.current) return;
      completedRef.current = true;
      document.body.style.overflow = "";
      onComplete();
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const navItems = document.querySelectorAll("[data-entrance-nav]");
    const ctaItems = document.querySelectorAll("[data-entrance-cta]");
    const themeItems = document.querySelectorAll("[data-entrance-theme]");
    const heroItems = document.querySelectorAll("[data-entrance-hero]");
    const sidebarItems = document.querySelectorAll("[data-entrance-sidebar]");
    const anchor = logoAnchorRef.current;

    if (reduced) {
      gsap.set(hex, { strokeDashoffset: 0 });
      gsap.set(mark, { opacity: 1 });
      gsap.set([navItems, ctaItems, themeItems, heroItems, sidebarItems], {
        autoAlpha: 1,
        y: 0,
      });
      gsap.set(overlay, { autoAlpha: 0, pointerEvents: "none" });
      if (anchor) gsap.set(anchor, { autoAlpha: 1 });
      finish();
      return;
    }

    const pathLength = hex.getTotalLength();
    gsap.set(hex, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });
    gsap.set(mark, { opacity: 0 });
    gsap.set(flyingLogo, {
      autoAlpha: 1,
      scale: 1,
      x: 0,
      y: 0,
      transformOrigin: "50% 50%",
    });
    gsap.set(overlay, { autoAlpha: 1, pointerEvents: "auto" });
    if (anchor) gsap.set(anchor, { autoAlpha: 0 });

    gsap.set(navItems, { autoAlpha: 0, y: 8 });
    gsap.set(ctaItems, { autoAlpha: 0, y: 8 });
    gsap.set(themeItems, { autoAlpha: 0, y: 8 });
    gsap.set(heroItems, { autoAlpha: 0, y: 24 });
    gsap.set(sidebarItems, { autoAlpha: 0, y: 14 });

    const tl = gsap.timeline({ onComplete: finish });

    // 1. Logo intro
    tl.to(hex, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
    }).to(
      mark,
      {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      },
      "-=0.15",
    );

    tl.to({}, { duration: 0.15 });

    tl.add(() => {
      const target = logoAnchorRef.current;
      const flyer = flyingLogoRef.current;
      if (!target || !flyer) return;

      const targetRect = target.getBoundingClientRect();
      const flyerRect = flyer.getBoundingClientRect();
      const scale = targetRect.width / flyerRect.width;
      const dx =
        targetRect.left +
        targetRect.width / 2 -
        (flyerRect.left + flyerRect.width / 2);
      const dy =
        targetRect.top +
        targetRect.height / 2 -
        (flyerRect.top + flyerRect.height / 2);

      flyTargetRef.current = { x: dx, y: dy, scale };
    });

    tl.to(flyingLogo, {
      x: () => flyTargetRef.current.x,
      y: () => flyTargetRef.current.y,
      scale: () => flyTargetRef.current.scale,
      duration: 0.5,
      ease: "power2.out",
    });

    tl.add(() => {
      if (logoAnchorRef.current) {
        gsap.set(logoAnchorRef.current, { autoAlpha: 1 });
      }
    });

    tl.to(
      flyingLogo,
      {
        autoAlpha: 0,
        duration: 0.15,
        ease: "power2.in",
      },
      "<0.35",
    );

    tl.to(
      overlay,
      {
        autoAlpha: 0,
        duration: 0.25,
        ease: "power2.out",
        pointerEvents: "none",
      },
      "-=0.05",
    );

    // 2. Header reveal
    tl.to(
      navItems,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.09,
        ease: "power2.out",
      },
      "-=0.1",
    );

    tl.to(
      ctaItems,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.25",
    );

    tl.to(
      themeItems,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.45,
        ease: "power2.out",
      },
      "-=0.3",
    );

    // 3. Hero text reveal
    tl.to(
      heroItems,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.55,
        stagger: 0.12,
        ease: "power2.out",
      },
      "-=0.15",
    );

    // 4. Sidebars
    tl.to(
      sidebarItems,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      },
      "-=0.2",
    );
  }, [letter, logoAnchorRef, onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[10001] flex items-center justify-center bg-bg"
      aria-hidden="true"
    >
      <div
        ref={flyingLogoRef}
        className="w-[min(28vw,120px)] max-w-[120px] min-w-[88px]"
      >
        <LogoMark
          letter={letter}
          hexRef={hexRef}
          letterRef={letterRef}
          letterOpacity={0}
        />
      </div>
    </div>
  );
}

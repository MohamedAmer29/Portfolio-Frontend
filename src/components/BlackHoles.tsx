import { useRef, useEffect } from "react";

export function BlackHoles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        entry.target.classList.toggle("in-view", entry.isIntersecting);
      },
      { threshold: 0.1 },
    );
    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const dots = [...Array(20)].map((_, i) => ({
    id: i,
    size: 2 + Math.random() * 4,
    top: Math.random() * 100,
    left: Math.random() * 100,
    speed: 8 + Math.random() * 12,
    delay: i * 0.3,
  }));

  return (
    <div ref={containerRef} className="black-dots-wrapper">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className="black-dot"
          style={{
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            top: `${dot.top}%`,
            left: `${dot.left}%`,
            animationDuration: `${dot.speed}s`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function ThemeIcon({ dark }: { dark: boolean }) {
  if (dark) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" className="block">
        <defs>
          <radialGradient id="sun-grad">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </radialGradient>
        </defs>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return (
            <line
              key={i}
              x1={12 + Math.cos(angle) * 9}
              y1={12 + Math.sin(angle) * 9}
              x2={12 + Math.cos(angle) * 11}
              y2={12 + Math.sin(angle) * 11}
              stroke="#fbbf24"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity={0.6}
            />
          );
        })}
        <circle cx="12" cy="12" r="6" fill="url(#sun-grad)" />
        <circle r="5" fill="#0f1214">
          <animateMotion
            dur="4s"
            repeatCount="indefinite"
            path="M12,12 m-6,0 a6,4 0 1,0 12,0 a6,4 0 1,0 -12,0"
          />
        </circle>
      </svg>
    );
  }

  return (
    <svg width="24" height="24" viewBox="0 0 24 24" className="block">
      <defs>
        <radialGradient id="moon-grad">
          <stop offset="0%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </radialGradient>
      </defs>
      <circle cx="12" cy="12" r="6" fill="url(#moon-grad)" />
      <circle cx="10" cy="11" r="1.2" fill="#94a3b8" opacity={0.6} />
      <circle cx="13.5" cy="13" r="0.8" fill="#94a3b8" opacity={0.5} />
      <circle cx="11" cy="14" r="0.6" fill="#94a3b8" opacity={0.4} />
      <circle r="5.5" fill="#1e293b" opacity={0.7}>
        <animateMotion
          dur="5s"
          repeatCount="indefinite"
          path="M12,12 m-7.2,0 a7.2,4.8 0 1,0 14.4,0 a7.2,4.8 0 1,0 -14.4,0"
        />
      </circle>
    </svg>
  );
}

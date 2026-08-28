import { forwardRef } from "react";

export const HEX_PATH =
  "M50 5 L88.5 27.5 L88.5 72.5 L50 95 L11.5 72.5 L11.5 27.5 Z";

type LogoMarkProps = {
  letter: string;
  className?: string;
  hexRef?: React.Ref<SVGPathElement>;
  letterRef?: React.Ref<SVGTextElement>;
  letterOpacity?: number;
};

export const LogoMark = forwardRef<SVGSVGElement, LogoMarkProps>(
  function LogoMark(
    { letter, className = "", hexRef, letterRef, letterOpacity = 1 },
    ref,
  ) {
    return (
      <svg
        ref={ref}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`block size-full select-none text-ink ${className}`.trim()}
        aria-hidden="true"
      >
        <path
          ref={hexRef}
          d={HEX_PATH}
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
          opacity={letterOpacity}
        >
          {letter}
        </text>
      </svg>
    );
  },
);

import { forwardRef } from "react";
import { LogoMark } from "./LogoMark";

type LogoProps = {
  letter: string;
  className?: string;
  asLink?: boolean;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>(function Logo(
  { letter, className = "", asLink = true },
  ref,
) {
  const classes =
    `inline-grid size-10 place-items-center text-ink transition duration-200 hover:-translate-y-0.5 hover:text-accent md:size-11 ${className}`.trim();

  if (!asLink) {
    return (
      <div className={classes}>
        <LogoMark letter={letter} />
      </div>
    );
  }

  return (
    <a ref={ref} href="#top" className={classes} aria-label="Home">
      <LogoMark letter={letter} />
    </a>
  );
});

import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { LogoMark } from "./LogoMark";

type LogoProps = {
  letter: string;
  className?: string;
  asLink?: boolean;
  to?: string;
};

export const Logo = forwardRef<HTMLAnchorElement, LogoProps>(function Logo(
  { letter, className = "", asLink = true, to },
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

  if (to) {
    return (
      <Link ref={ref} to={to} className={classes} aria-label="Home">
        <LogoMark letter={letter} />
      </Link>
    );
  }

  return (
    <a ref={ref} href="#top" className={classes} aria-label="Home">
      <LogoMark letter={letter} />
    </a>
  );
});

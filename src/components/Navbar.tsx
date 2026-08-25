import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { useDarkMode } from "../hooks/useDarkMode";

const links = [
  { href: "#about", label: "ABOUT", num: "01." },
  { href: "#experience", label: "EXPERIENCE", num: "02." },
  { href: "#work", label: "WORK", num: "03." },
  { href: "#contact", label: "CONTACT", num: "04." },
];

type NavbarProps = {
  letter: string;
  resumeUrl: string;
  activeSection: string;
};

export function Navbar({ letter, resumeUrl, activeSection }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useDarkMode();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[100] flex h-[70px] items-center justify-between px-[18px] backdrop-blur-md backdrop-saturate-200 transition duration-300 md:h-20 md:px-10 ${
          scrolled ? "bg-bg/10 shadow-nav" : "bg-bg/10"
        }`}
      >
        <Logo letter={letter} />

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => {
            const isActive = link.href === `#${activeSection}`;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`font-mono text-nav tracking-wide transition ${isActive ? "text-accent" : "text-ink hover:text-accent"}`}
              >
                <span className={`mr-1 ${isActive ? "text-accent" : "text-ink-soft"}`}>{link.num}</span>
                {link.label}
              </a>
            );
          })}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            className="ml-3 inline-flex items-center justify-center rounded border border-ink px-[1.1rem] py-[0.55rem] font-mono text-nav tracking-wide text-ink transition hover:border-accent hover:bg-accent/20"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="ml-2 grid size-9 place-items-center rounded border border-ink/30 text-ink-muted transition-all duration-300 hover:border-accent hover:text-accent"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </div>

        <button
          type="button"
          className="relative grid size-10 place-items-center bg-transparent md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <span
            className={`block h-0.5 w-[22px] bg-ink transition ${
              open ? "bg-transparent" : ""
            }`}
          >
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-[22px] -translate-x-1/2 bg-ink transition ${
                open ? "-translate-y-1/2 rotate-45" : "-translate-y-[11px]"
              }`}
            />
            <span
              className={`absolute left-1/2 top-1/2 block h-0.5 w-[22px] -translate-x-1/2 bg-ink transition ${
                open
                  ? "-translate-y-1/2 -rotate-45"
                  : "translate-y-[5px] opacity-0"
              }`}
            />
          </span>
        </button>
      </header>

      <div
        className={`fixed inset-0 z-[98] bg-ink/30 transition md:hidden ${
          open
            ? "pointer-events-auto opacity-80"
            : "pointer-events-none opacity-0"
        }`}
        onClick={close}
        aria-hidden={!open}
      />

      <aside
        className={`fixed bottom-0 right-0 top-0 z-[99] grid w-[min(75vw,320px)] place-items-center bg-bg shadow-[-12px_0_40px_rgba(26,31,36,0.08)] transition duration-300 md:hidden ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <nav className="flex flex-col items-center gap-6">
          {links.map((link) => {
            const isActive = link.href === `#${activeSection}`;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={close}
                className={`font-mono text-[15px] tracking-wide transition ${isActive ? "text-accent" : "text-ink hover:text-accent"}`}
              >
                <span className={`mr-1 ${isActive ? "text-accent" : "text-ink-soft"}`}>{link.num}</span>
                {link.label}
              </a>
            );
          })}
          <a
            href={resumeUrl}
            target="_blank"
            rel="noreferrer"
            onClick={close}
            className="inline-flex items-center justify-center rounded border border-ink px-[1.1rem] py-[0.55rem] font-mono text-nav tracking-wide transition hover:border-accent hover:bg-accent/20"
          >
            Resume
          </a>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            className="mt-2 grid size-10 place-items-center rounded border border-ink/30 text-ink-muted transition-all duration-300 hover:border-accent hover:text-accent"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>
        </nav>
      </aside>
    </>
  );
}

import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { ThemeIcon } from "./ThemeIcon";

const links = [
  { href: "#about", label: "ABOUT", num: "01." },
  { href: "#skills", label: "SKILLS", num: "02." },
  { href: "#education", label: "EDUCATION", num: "03." },
  { href: "#experience", label: "EXPERIENCE", num: "04." },
  { href: "#work", label: "WORK", num: "05." },
  { href: "#contact", label: "CONTACT", num: "06." },
];

type NavbarProps = {
  letter: string;
  resumeUrl: string;
  activeSection: string;
  dark: boolean;
  onToggleTheme: () => void;
};

export function Navbar({
  letter,
  resumeUrl,
  activeSection,
  dark,
  onToggleTheme,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      document.body.style.overflow = open ? "hidden" : "";
    });
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav
        className={`fixed inset-x-0 top-0 z-[100] flex h-[70px] items-center justify-between px-[18px] backdrop-blur-md backdrop-saturate-200 transition duration-300 md:h-20 md:px-10 ${
          scrolled
            ? "bg-bg/10 shadow-nav"
            : "bg-bg/10"
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
                <span
                  className={`mr-1 ${isActive ? "text-accent" : "text-ink-soft"}`}
                >
                  {link.num}
                </span>
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
            onClick={onToggleTheme}
            className="ml-2 grid size-9 place-items-center rounded border border-ink/30 text-ink-muted transition-all duration-300 hover:border-accent hover:text-accent cursor-pointer overflow-hidden"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon dark={dark} />
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
      </nav>

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
                <span
                  className={`mr-1 ${isActive ? "text-accent" : "text-ink-soft"}`}
                >
                  {link.num}
                </span>
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
            onClick={onToggleTheme}
            className="mt-2 grid size-10 place-items-center rounded border border-ink/30 text-ink-muted transition-all duration-300 hover:border-accent hover:text-accent cursor-pointer overflow-hidden"
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <ThemeIcon dark={dark} />
          </button>
        </nav>
      </aside>
    </>
  );
}

import { useRef } from "react";
import { useGSAP } from "../lib/gsap";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const gsap: any;

type SidebarsProps = {
  email: string;
  github: string;
  linkedin: string;
};

export function Sidebars({ email, github, linkedin }: SidebarsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const items = el.querySelectorAll("[data-sidebar-item]");
    if (reduced) {
      gsap.set(items, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.from(items, {
      autoAlpha: 0,
      y: 14,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
      delay: 0.2,
    });
  }, []);

  return (
    <div ref={ref} className="contents">
      <aside
        className="fixed bottom-0 left-[110px] z-50 hidden w-10 text-ink-muted xl:block"
        aria-label="Social links"
      >
        <div className="flex flex-col items-center gap-4 after:mt-4 after:h-[90px] after:w-px after:bg-ink-muted/55 after:content-['']">
          <a
            data-sidebar-item
            className="grid size-[22px] place-items-center transition hover:-translate-y-1 hover:scale-110 hover:text-accent"
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="size-full"
            >
              <path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5m12 5v-3.4c0-.9-.3-1.6-.8-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.7-.1-3.4 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.8 2.5 5.7 2.8 5.7 2.8c-.7 1.7-.2 3.1-.1 3.4-.8.9-1.3 2-1.3 3.4 0 4.8 2.9 5.9 5.7 6.2-.4.3-.7.9-.8 1.7V22" />
            </svg>
          </a>
          <a
            data-sidebar-item
            className="grid size-[22px] place-items-center transition hover:-translate-y-1 hover:scale-110 hover:text-accent"
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              className="size-full"
            >
              <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
              <rect x="2" y="9" width="4" height="12" />
              <circle cx="4" cy="4" r="2" />
            </svg>
          </a>
        </div>
      </aside>

      <aside
        className="fixed bottom-0 right-[88px] z-40 hidden w-10 text-ink-muted xl:block"
        aria-label="Email"
      >
        <div className="flex flex-col items-center gap-4 after:mt-4 after:h-[90px] after:w-px after:bg-ink-muted/55 after:content-['']">
          <a
            data-sidebar-item
            className="writing-vertical font-mono text-[12px] tracking-[0.12em] transition hover:-translate-y-1 hover:scale-110 hover:text-accent"
            href={`mailto:${email}`}
          >
            {email}
          </a>
        </div>
      </aside>
    </div>
  );
}

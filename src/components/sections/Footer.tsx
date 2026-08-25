type FooterProps = {
  name: string;
  github: string;
  linkedin: string;
};

function IconGitHub() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className="size-full"
    >
      <path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5m12 5v-3.4c0-.9-.3-1.6-.8-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.7-.1-3.4 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.8 2.5 5.7 2.8 5.7 2.8c-.7 1.7-.2 3.1-.1 3.4-.8.9-1.3 2-1.3 3.4 0 4.8 2.9 5.9 5.7 6.2-.4.3-.7.9-.8 1.7V22" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
      className="size-full"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Footer({ name, github, linkedin }: FooterProps) {
  return (
    <footer className="border-t border-ink/8 px-6 pb-14 pt-10 text-center font-mono text-[12px] text-ink-soft">
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <p>
          Built by{" "}
          <a
            href="#top"
            className="text-ink-muted transition-colors duration-200 hover:text-accent"
          >
            {name}
          </a>
        </p>
        <div className="mt-5 flex justify-center gap-5 xl:hidden">
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="grid size-[22px] place-items-center text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
          >
            <IconGitHub />
          </a>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="grid size-[22px] place-items-center text-ink-muted transition-all duration-200 hover:-translate-y-0.5 hover:text-accent"
          >
            <IconLinkedIn />
          </a>
        </div>
      </div>
    </footer>
  );
}

import { motion, type Variants } from "framer-motion";

type SidebarsProps = {
  email: string;
  github: string;
  linkedin: string;
  phone?: string;
};

const sidebarContainerVariants: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.95,
    },
  },
};

const sidebarItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function gmailComposeUrl(email: string) {
  return `https://mail.google.com/mail/?view=cm&to=${encodeURIComponent(email)}`;
}

function whatsAppUrl(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}`;
}

export function Sidebars({ email, github, linkedin, phone }: SidebarsProps) {
  return (
    <div className="contents">
      <aside
        className="fixed bottom-0 left-[110px] z-50 hidden w-10 text-ink-muted xl:block"
        aria-label="Social links"
      >
        <motion.div
          variants={sidebarContainerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-4 after:mt-4 after:h-[90px] after:w-px after:bg-ink-muted/55 after:content-['']"
        >
          <motion.a
            variants={sidebarItemVariants}
            data-entrance-sidebar
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
          </motion.a>
          <motion.a
            variants={sidebarItemVariants}
            data-entrance-sidebar
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
          </motion.a>
          {phone && (
            <motion.a
              variants={sidebarItemVariants}
              data-entrance-sidebar
              className="grid size-[22px] place-items-center transition hover:-translate-y-1 hover:scale-110 hover:text-accent"
              href={whatsAppUrl(phone)}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="size-full"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </motion.a>
          )}
        </motion.div>
      </aside>

      <aside
        className="fixed bottom-0 right-[88px] z-40 hidden w-10 text-ink-muted xl:block"
        aria-label="Email"
      >
        <motion.div
          variants={sidebarContainerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center gap-4 after:mt-4 after:h-[90px] after:w-px after:bg-ink-muted/55 after:content-['']"
        >
          <motion.a
            variants={sidebarItemVariants}
            data-entrance-sidebar
            className="writing-vertical font-mono text-[12px] tracking-[0.12em] transition hover:-translate-y-1 hover:scale-110 hover:text-accent"
            href={gmailComposeUrl(email)}
            target="_blank"
            rel="noreferrer"
          >
            {email}
          </motion.a>
        </motion.div>
      </aside>
    </div>
  );
}

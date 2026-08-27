import { useRef } from "react";
import { motion } from "framer-motion";
import { useGSAP } from "../../lib/gsap";
import { useHero } from "../../hooks/useHero";

type HeroProps = {
  greeting: string;
  name: string;
  tagline: string;
  bio: string;
};

export function Hero({ greeting, name, tagline, bio }: HeroProps) {
  const { data: hero } = useHero();
  const rootRef = useRef<HTMLElement>(null);

  const displayName = hero?.fullName ?? name;
  const displayTagline = hero?.bio ?? tagline;
  const displayBio = hero?.description ?? bio;

  useGSAP(() => {
    if (!rootRef.current) return;

    const items = rootRef.current.querySelectorAll("[data-hero-item]");

    gsap.fromTo(
      items,
      { autoAlpha: 0, y: 28 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.85,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      },
    );
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section
      ref={rootRef}
      className="flex min-h-svh items-center px-4 pb-12 pt-24 md:px-0 md:pb-0 md:pt-20"
      id="top"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto w-full max-w-[720px] md:w-[min(100%-10rem,1000px)]"
      >
        <motion.p
          variants={itemVariants}
          data-hero-item
          className="mb-3 font-mono text-[13px] tracking-wide text-accent md:mb-5 md:text-[14px]"
        >
          {greeting}
        </motion.p>
        <motion.h1
          variants={itemVariants}
          data-hero-item
          className="mb-2 font-sans text-[clamp(2.25rem,8vw,5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-ink"
        >
          {displayName}
        </motion.h1>
        <motion.p
          variants={itemVariants}
          data-hero-item
          className="mb-5 font-sans text-[clamp(1.5rem,5vw,4rem)] font-bold leading-[1.1] tracking-[-0.025em] text-ink-muted md:mb-6"
        >
          {displayTagline}
        </motion.p>
        <motion.p
          variants={itemVariants}
          data-hero-item
          className="max-w-[34rem] text-[15px] leading-[1.7] text-ink-muted md:text-body"
        >
          {displayBio}
        </motion.p>

        <motion.a
          variants={itemVariants}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          data-hero-item
          className="mt-8 inline-flex text-ink-muted transition-colors duration-300 hover:text-accent md:mt-12"
          href="#about"
          aria-label="Scroll to about"
        >
          <span
            className="relative h-[38px] w-[24px] rounded-[14px] border-[1.5px] border-current transition-colors duration-300 hover:border-accent"
            aria-hidden="true"
          >
            <span className="animate-scroll-dot absolute left-1/2 top-[8px] size-1 -translate-x-1/2 rounded-full bg-current" />
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}

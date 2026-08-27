import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { useAboutMe } from "../../hooks/useAboutMe";
import { useGSAP } from "../../lib/gsap";

declare const gsap: any;

type AboutProps = {
  paragraphs: readonly string[];
  tech: readonly string[];
  letter: string;
  image?: string;
};

export function About({ paragraphs, tech, letter, image }: AboutProps) {
  const { data: about } = useAboutMe();
  const [intro, ...rest] = about?.sentences ?? paragraphs;
  const body = rest;
  const techList = about?.technologies.map((t) => t.name) ?? tech;
  const rawImageUrl = about?.image || image;
  const imageUrl = rawImageUrl && rawImageUrl.includes('cloudinary.com')
    ? rawImageUrl.replace('/upload/', '/upload/w_600,c_limit,f_auto,q_auto/')
    : rawImageUrl;
  const [failedUrls, setFailedUrls] = useState<Record<string, boolean>>({});
  const photoRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleImageError = () => {
    if (imageUrl) {
      setFailedUrls((prev) => ({ ...prev, [imageUrl]: true }));
    }
  };

  const shouldShowFallback = !imageUrl || Boolean(failedUrls[imageUrl]);

  // GSAP animation on dynamic backend data changes
  useGSAP(() => {
    if (!about || !contentRef.current) return;

    gsap.fromTo(
      contentRef.current.children,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }
    );
  }, [about]);

  useGSAP(() => {
    if (!photoRef.current) return;

    // ScrollTrigger entrance animation for photo frame
    gsap.fromTo(
      photoRef.current,
      { opacity: 0, y: 30, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: photoRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      }
    );

    // Smooth hover animation for image scale and filter using GSAP
    if (imgRef.current) {
      const frameEl = photoRef.current;
      const imgEl = imgRef.current;

      const onMouseEnter = () => {
        gsap.to(imgEl, {
          scale: 1.06,
          filter: "grayscale(0%) contrast(105%)",
          duration: 0.6,
          ease: "power2.out",
        });
      };

      const onMouseLeave = () => {
        gsap.to(imgEl, {
          scale: 1,
          filter: "grayscale(100%) contrast(105%)",
          duration: 0.6,
          ease: "power2.out",
        });
      };

      frameEl.addEventListener("mouseenter", onMouseEnter);
      frameEl.addEventListener("mouseleave", onMouseLeave);

      return () => {
        frameEl.removeEventListener("mouseenter", onMouseEnter);
        frameEl.removeEventListener("mouseleave", onMouseLeave);
      };
    }
  }, [shouldShowFallback]);

  return (
    <section
      className="scroll-mt-20 px-5 py-[72px] md:px-0 md:py-[100px]"
      id="about"
    >
      <div className="mx-auto w-full max-w-[1000px] md:w-[min(100%-10rem,1000px)]">
        <Reveal>
          <SectionHeading number="01." title="About Me" />
        </Reveal>

        <div className="grid items-start gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-12">
          <Reveal delay={0.08}>
            <div ref={contentRef} className="space-y-4 text-[17px] leading-[1.7] text-ink-muted md:text-body">
              <p className="max-w-[540px]">{intro}</p>
              {body.map((paragraph) => (
                <p key={paragraph.slice(0, 24)} className="max-w-[540px]">
                  {paragraph}
                </p>
              ))}
              <p className="max-w-[540px]">
                Here are a few technologies I've been working with recently:
              </p>
              <ul className="mt-4 grid max-w-[480px] grid-cols-2 gap-x-5 gap-y-2.5 md:grid-cols-3">
                {techList.map((item) => (
                  <li
                    key={item}
                    className="relative pl-4 font-mono text-[13px] text-ink-muted before:absolute before:left-0 before:top-[2px] before:text-[11px] before:text-accent before:content-['▸']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <div className="justify-self-center md:justify-self-end">
            <motion.div
              ref={photoRef}
              className="photo-frame"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              {!shouldShowFallback ? (
                <motion.img
                  ref={imgRef}
                  src={imageUrl}
                  alt="Portrait"
                  onError={handleImageError}
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <span className="absolute inset-0 grid place-items-center text-[5.5rem] font-extrabold tracking-[-0.04em] text-white/30">
                  {letter}
                </span>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}


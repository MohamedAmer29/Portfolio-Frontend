import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CustomCursor } from "./components/CustomCursor";
import { EclipseTransition } from "./components/EclipseTransition";
import { MiniGame } from "./components/MiniGame";
import { Navbar } from "./components/Navbar";
import { useActiveSection } from "./hooks/useActiveSection";
import { useDarkMode } from "./hooks/useDarkMode";
import { PageLoader } from "./components/PageLoader";
import { Sidebars } from "./components/Sidebars";
import { About } from "./components/sections/About";
import { Contact } from "./components/sections/Contact";
import { Experience } from "./components/sections/Experience";
import { Footer } from "./components/sections/Footer";
import { Hero } from "./components/sections/Hero";
import { Projects } from "./components/sections/Projects";
import { EducationSection } from "./components/education/EducationSection";
import { SkillsSection } from "./components/skills/SkillsSection";
import { portfolio } from "./data/portfolio";
import { gsap, useGSAP } from "./lib/gsap";

const ScrollCar = lazy(() =>
  import("./components/ScrollCar").then((module) => ({
    default: module.ScrollCar,
  })),
);

function App() {
  const [showMiniGame, setShowMiniGame] = useState(false);
  const [ready, setReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [postGameLoading, setPostGameLoading] = useState(false);
  const [carShouldAnimate, setCarShouldAnimate] = useState(false);
  const [eclipseTarget, setEclipseTarget] = useState<boolean | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const activeSection = useActiveSection(["about", "skills", "education", "experience", "work", "contact"]);
  const [dark, setDark] = useDarkMode();

  useEffect(() => {
    // Check if mini-game has been shown before
    const hasSeenMiniGame = localStorage.getItem("hasSeenMiniGame");
    if (!hasSeenMiniGame) {
      setShowMiniGame(true);
      setShowLoader(false);
    }
  }, []);

  const onMiniGameComplete = useCallback(() => {
    localStorage.setItem("hasSeenMiniGame", "true");
    setShowMiniGame(false);
    setPostGameLoading(true);
    setTimeout(() => {
      setPostGameLoading(false);
      setReady(true);
      setTimeout(() => {
        setCarShouldAnimate(true);
      }, 350);
    }, 1800);
  }, []);

  const onLoaderComplete = useCallback(() => {
    setReady(true);
    setShowLoader(false);
    setTimeout(() => {
      setCarShouldAnimate(true);
    }, 350);
  }, []);

  const requestToggleTheme = useCallback(() => {
    setEclipseTarget(!dark);
  }, [dark]);

  const onEclipseDone = useCallback(() => {
    if (eclipseTarget !== null) {
      setDark(eclipseTarget);
      setEclipseTarget(null);
    }
  }, [eclipseTarget, setDark]);

  useGSAP(
    () => {
      if (!ready || !shellRef.current) return;
      gsap.fromTo(
        shellRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.35, ease: "power2.out" },
      );
    },
    { dependencies: [ready] },
  );

  return (
    <>
      {showMiniGame ? <MiniGame onComplete={onMiniGameComplete} /> : null}

      {postGameLoading && (
        <PageLoader letter={portfolio.logoLetter} onComplete={() => {}} />
      )}

      {showLoader ? (
        <PageLoader
          letter={portfolio.logoLetter}
          onComplete={onLoaderComplete}
        />
      ) : null}

      <CustomCursor />

      {eclipseTarget !== null && (
        <EclipseTransition toDark={eclipseTarget} onDone={onEclipseDone} />
      )}

      <div
        ref={shellRef}
        className="opacity-0"
        aria-hidden={!ready}
        style={{ visibility: ready ? "visible" : "hidden" }}
      >
        <Navbar letter={portfolio.logoLetter} resumeUrl={portfolio.resumeUrl} activeSection={activeSection} dark={dark} onToggleTheme={requestToggleTheme} />
        <Sidebars
          email={portfolio.email}
          github={portfolio.social.github}
          linkedin={portfolio.social.linkedin}
        />

        {ready ? (
          <Suspense fallback={null}>
            <ScrollCar shouldAnimate={carShouldAnimate} />
          </Suspense>
        ) : null}

        <main>
          <Hero
            greeting={portfolio.hero.greeting}
            name={portfolio.fullName}
            tagline={portfolio.hero.tagline}
            bio={portfolio.hero.bio}
            ready={ready}
          />
          <About
            paragraphs={portfolio.about.paragraphs}
            tech={portfolio.about.tech}
            letter={portfolio.logoLetter}
          />
          <SkillsSection />
          <EducationSection />
          <Experience jobs={portfolio.experience} />
          <Projects projects={portfolio.projects} />
          <Contact
            eyebrow={portfolio.contact.eyebrow}
            title={portfolio.contact.title}
            blurb={portfolio.contact.blurb}
            email={portfolio.email}
          />
        </main>

        <Footer
          name={portfolio.name}
          github={portfolio.social.github}
          linkedin={portfolio.social.linkedin}
        />
      </div>
    </>
  );
}

export default App;

import { lazy, Suspense, useRef, useState } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { Navbar } from "../components/Navbar";
import { portfolio } from "../data/portfolio";

const EclipseTransition = lazy(() =>
  import("../components/EclipseTransition").then((module) => ({
    default: module.EclipseTransition,
  })),
);

const CustomCursor = lazy(() =>
  import("../components/CustomCursor").then((module) => ({
    default: module.CustomCursor,
  })),
);

const resumeData = {
  firstName: "Mohamed",
  lastName: "Amer",
  title: "Full Stack Developer",
  location: "Tanta, Gharbia, Egypt",
  contact: {
    phone: "01009487734",
    email: "mohamed1amer0@gmail.com",
    linkedin: "https://linkedin.com/in/mohamed-amer-86631525a",
    github: "https://github.com/MohamedAmer29",
  },
  summary:
    "Full Stack Developer specializing in React, TypeScript, Node.js, NestJS, and PostgreSQL. Experienced in building scalable web applications, secure REST APIs, and responsive user interfaces. Skilled in JWT authentication, role-based authorization, Redis, Docker, and database design. Experienced in Three.js and 3D web development for creating interactive and immersive experiences, along with Redis, Docker, TypeORM, Tanstack, Redux, and Tailwind CSS. Strong focus on clean architecture, performance optimization, scalability, and maintainable code.",
  workExperience: [
    {
      company: "Graduation Project",
      location: "Remote",
      title: "Frontend Developer",
      range: "Sep 2025 – Jan 2026",
      achievements: [
        "Implemented JWT-based authentication and role-based access control across 4 user roles, supporting secure access to clinic workflows.",
        "Developed interfaces for appointment scheduling, queue management, payment management, and dashboards.",
        "Developed 20+ reusable and scalable UI components using React, TypeScript, and Styled Components.",
        "Integrated AI-based dental X-ray analysis for detecting multiple dental conditions.",
        "Optimized responsive components for cross-browser compatibility and consistent user experience across modern browsers.",
      ],
    },
    {
      company: "Benha University",
      location: "Remote",
      title: "Software Engineer Intern",
      range: "Oct 2024 – Nov 2024",
      achievements: [
        "Supported 5+ departmental tasks and day-to-day activities, gaining practical exposure to software engineering workflows, organizational processes, and professional development practices.",
        "Collaborated with peers, leadership, and customers, demonstrating strong communication and teamwork skills.",
      ],
    },
    {
      company: "ALX Africa Training",
      location: "Remote",
      title: "Frontend Developer",
      range: "Jan 2023 – Mar 2023",
      achievements: [
        "Completed an intensive 36+ hours/week software development program covering C, Bash, Linux, Git, and command-line development.",
        "Applied JavaScript and frontend development concepts through practical coding exercises, strengthening problem-solving.",
      ],
    },
  ],
  projects: [
    {
      name: "Employee Management System (EMS)",
      tech: "React, TypeScript, NestJS, PostgreSQL, TypeORM, Redis, Docker",
      description: "",
      details: [
        "Developed a full-stack Employee Management System supporting 3 user roles and 20+ core administrative features using React, NestJS, PostgreSQL, Redis, and Docker.",
        "Implemented JWT authentication, role-based authorization across 3 user roles, 140+ RESTful APIs, automated attendance processing, dashboard analytics, notifications, and audit logging, with PostgreSQL for data management and Redis for caching.",
      ],
      github: "https://github.com/MohamedAmer29/Employee-Management-System-FrontEnd",
    },
    {
      name: "Portfolio",
      tech: "React, TypeScript, Tailwind CSS, Three Fiber, NestJS, PostgreSQL, TypeORM, Redis, Docker",
      description: "",
      details: [
        "A modern full-stack developer portfolio designed to showcase 3+ projects, technical skills, experience, and services through an interactive and engaging user experience.",
        "Built with React, TypeScript, and Tailwind CSS, with Three.js and React Three Fiber used to create interactive 3D elements and immersive visual experiences.",
        "The backend is powered by NestJS and PostgreSQL, with Redis for caching and performance optimization.",
      ],
      github: "https://github.com/MohamedAmer29/Portfolio-FrontEnd",
    },
    {
      name: "E-Commerce Application",
      tech: "MongoDB, Express.js, React, Node.js, TypeScript",
      description: "",
      details: [
        "A full-stack e-commerce application built using the MERN stack, providing a complete online shopping experience for customers and an intuitive management interface for administrators.",
        "Implemented features including user authentication, product management, product search and filtering, shopping cart, checkout, order management, and role-based access control, with RESTful APIs connecting the frontend and backend.",
      ],
      github: "https://github.com/MohamedAmer29/Ecommerce-App",
    },
    {
      name: "Chit Chat Application",
      tech: "React, TypeScript, Firebase, Tailwind CSS",
      description: "",
      details: [
        "A real-time chat application built with React and Firebase, enabling users to communicate through instant messaging.",
        "Implemented user authentication, real-time messaging, online user presence, chat management, and message synchronization using Firebase services, with a responsive UI designed using Tailwind CSS.",
      ],
      github: "https://github.com/MohamedAmer29/Chit-Chat",
    },
  ],
  skills: {
    frontend: "React.js, Styled Components, CSS, HTML, TS, JS, Tailwind, Redux, Tanstack, Three.js, React Three Fiber",
    backend: "Node.js, NestJS, Express, TypeORM, MongoDB, PostgreSQL, REST API, MySQL, Firebase, Redis",
    others: "Docker, Postman, Swagger, JWT, RBAC, API Integration, Framer Motion, GitHub, System Design, Agile, Git",
    core: "API Integration, Database Design, Security Best Practices, Performance Optimization",
  },
  education: {
    institution: "Benha University",
    location: "Qalyubia, Egypt",
    program: "Faculty of Computer Science and AI | CS Department | GPA: 3.6/4",
    range: "2022 – 2026",
  },
};

function IconPhone() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0" aria-hidden="true">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconMail() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function IconLinkedIn() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-3.5 shrink-0" aria-hidden="true">
      <path d="M9 19c-4.3 1.4-4.3-2.1-6-2.5m12 5v-3.4c0-.9-.3-1.6-.8-2 2.8-.3 5.7-1.4 5.7-6.2 0-1.4-.5-2.5-1.3-3.4.1-.3.6-1.7-.1-3.4 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.8 2.5 5.7 2.8 5.7 2.8c-.7 1.7-.2 3.1-.1 3.4-.8.9-1.3 2-1.3 3.4 0 4.8 2.9 5.9 5.7 6.2-.4.3-.7.9-.8 1.7V22" />
    </svg>
  );
}

const ContactIcon = ({ children }: { children: React.ReactNode }) => (
  <span className="grid size-4 place-items-center text-ink-muted">{children}</span>
);

function AccentHeading({ first, rest }: { first: string; rest: string }) {
  return (
    <h2 className="mb-7 flex items-center gap-4 font-sans text-section font-bold text-ink md:mb-10">
      <span className="shrink-0 font-mono text-[0.85em] font-medium text-ink-muted">01.</span>
      <span className="shrink-0">
        <span className="text-accent">{first}</span>
        {rest}
      </span>
      <span className="h-px min-w-8 max-w-[280px] flex-1 bg-accent/70" />
    </h2>
  );
}

export default function Resume() {
  const [dark, setDark] = useDarkMode();
  const logoAnchorRef = useRef<HTMLAnchorElement>(null);
  const [eclipseTarget, setEclipseTarget] = useState<boolean | null>(null);

  const requestToggleTheme = () => {
    setEclipseTarget(!dark);
  };

  const onEclipseDone = () => {
    if (eclipseTarget !== null) {
      setDark(eclipseTarget);
      setEclipseTarget(null);
    }
  };

  return (
    <>
      {eclipseTarget !== null && (
        <Suspense fallback={null}>
          <EclipseTransition toDark={eclipseTarget} onDone={onEclipseDone} />
        </Suspense>
      )}

      <Suspense fallback={null}>
        <CustomCursor />
      </Suspense>

      <Navbar
        letter={portfolio.logoLetter}
        activeSection=""
        dark={dark}
        onToggleTheme={requestToggleTheme}
        logoAnchorRef={logoAnchorRef}
      />

      <main className="relative z-10 mx-auto max-w-[1000px] px-5 pt-24 pb-16 md:px-0 md:pt-28 md:pb-20">
        <div className="mb-8 flex justify-center">
            <a
              href={portfolio.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-bg transition hover:opacity-90"
            >
              Download CV
            </a>
          </div>

          <div className="resume-card mx-auto rounded-xl bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] md:p-8 lg:p-10">
          <header className="mb-8 text-center">
            <h1 className="mb-1 font-sans text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] text-ink">
              <span className="font-light">{resumeData.firstName}</span>{" "}
              <span className="font-bold">{resumeData.lastName}</span>
            </h1>
            <p className="mb-2 font-mono text-[13px] tracking-wide text-ink-muted">
              {resumeData.title}
            </p>
            <p className="mb-4 font-mono text-[13px] italic tracking-wide text-ink-muted">
              {resumeData.location}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-mono text-[12px] text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <ContactIcon><IconPhone /></ContactIcon>
                <a
                  href="https://wa.me/+201009487734"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  {resumeData.contact.phone}
                </a>
              </span>
              <span className="hidden sm:inline text-ink-soft/50">|</span>
              <span className="inline-flex items-center gap-1.5">
                <ContactIcon><IconMail /></ContactIcon>
                <a
                  href={`mailto:${resumeData.contact.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {resumeData.contact.email}
                </a>
              </span>
              <span className="hidden sm:inline text-ink-soft/50">|</span>
              <span className="inline-flex items-center gap-1.5">
                <ContactIcon><IconLinkedIn /></ContactIcon>
                <a
                  href={resumeData.contact.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  LinkedIn
                </a>
              </span>
              <span className="hidden sm:inline text-ink-soft/50">|</span>
              <span className="inline-flex items-center gap-1.5">
                <ContactIcon><IconGithub /></ContactIcon>
                <a
                  href={resumeData.contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors hover:text-accent"
                >
                  GitHub
                </a>
              </span>
            </div>
          </header>

              {resumeData.summary && (
            <p className="mb-8 text-center text-[15px] leading-[1.8] tracking-wide text-ink-muted">
              {resumeData.summary}
            </p>
          )}

          <hr className="mb-8 border-ink/10" />

          <section className="mb-10">
            <AccentHeading first="Wor" rest="k Experience" />

            {resumeData.workExperience.map((job, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="mb-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-bold text-ink">{job.company}</span>
                  {job.location && (
                    <span className="italic text-accent sm:text-right">{job.location}</span>
                  )}
                </div>
                <div className="mb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-ink">{job.title}</span>
                  <span className="italic text-ink-muted sm:text-right">{job.range}</span>
                </div>
                <ul className="space-y-2">
                  {job.achievements.map((a, j) => (
                    <li key={j} className="relative pl-4 text-[15px] leading-[1.8] tracking-wide text-ink-muted before:absolute before:left-0 before:top-[7px] before:text-accent before:content-['▸']">
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mb-10">
            <AccentHeading first="Proj" rest="ects" />

            {resumeData.projects.map((proj, i) => (
              <div key={i} className="mb-6 last:mb-0">
                <div className="mb-1 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-bold text-ink">{proj.name}</span>
                  <span className="italic text-accent sm:text-right">{proj.tech}</span>
                </div>
                <div className="mb-2 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="text-ink" />
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink-soft hover:text-accent sm:text-right"
                  >
                    Github
                  </a>
                </div>
                <ul className="space-y-1">
                  {proj.details.map((d, j) => (
                    <li key={j} className="relative pl-4 text-[15px] leading-[1.8] tracking-wide text-ink-muted before:absolute before:left-0 before:top-[7px] before:text-accent before:content-['▸']">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mb-10">
            <AccentHeading first="Techn" rest="ical Skills" />

            <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
              {[
                { label: "Frontend", values: resumeData.skills.frontend },
                { label: "Backend & Databases", values: resumeData.skills.backend },
                { label: "Others", values: resumeData.skills.others },
                { label: "Core Competencies", values: resumeData.skills.core },
              ].map((cat, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-2">
                  <span className="font-bold text-ink tracking-wide">{cat.label}:</span>
                  <span className="text-[15px] tracking-wide text-ink-muted">{cat.values}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <AccentHeading first="Edu" rest="cation" />

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <span className="font-bold text-ink tracking-wide">{resumeData.education.institution}</span>
              <span className="italic text-accent sm:text-right tracking-wide">{resumeData.education.location}</span>
            </div>
            <div className="mb-3 flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <span className="text-ink">{resumeData.education.program}</span>
              <span className="italic text-ink-muted sm:text-right">{resumeData.education.range}</span>
            </div>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <a
            href={portfolio.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-sm border border-accent bg-accent px-5 py-2 font-mono text-[12px] uppercase tracking-[0.1em] text-bg transition hover:opacity-90"
          >
            Download CV
          </a>
        </div>
      </main>
    </>
  );
}
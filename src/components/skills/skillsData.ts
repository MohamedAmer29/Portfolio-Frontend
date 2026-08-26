export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ai";

export interface Skill {
  name: string;
  category: SkillCategory;
  description: string;
  related: string[];
  level: number;
}

export const CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Databases" },
  { id: "devops", label: "DevOps" },
  { id: "ai", label: "AI & Vision" },
];

export const skills: Skill[] = [
  {
    name: "React",
    category: "frontend",
    description:
      "Component-based UI library for building interactive web applications",
    related: ["TypeScript", "Redux", "TanStack Query"],
    level: 95,
  },
  {
    name: "TypeScript",
    category: "frontend",
    description:
      "Typed superset of JavaScript for scalable, maintainable codebases",
    related: ["React", "Node.js", "NestJS"],
    level: 92,
  },
  {
    name: "JavaScript",
    category: "frontend",
    description: "Core language of the web, powering both client and server",
    related: ["React", "TypeScript", "Node.js"],
    level: 95,
  },
  {
    name: "HTML5",
    category: "frontend",
    description: "Semantic markup for accessible, SEO-friendly web pages",
    related: ["CSS3", "JavaScript"],
    level: 95,
  },
  {
    name: "CSS3",
    category: "frontend",
    description:
      "Styling language for layout, animations, and responsive design",
    related: ["Tailwind CSS", "HTML5"],
    level: 90,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    description: "Utility-first CSS framework for rapid UI development",
    related: ["CSS3", "React"],
    level: 90,
  },
  {
    name: "Redux",
    category: "frontend",
    description: "Predictable state container for complex application logic",
    related: ["React", "TypeScript"],
    level: 85,
  },
  {
    name: "TanStack Query",
    category: "frontend",
    description: "Powerful data synchronization and caching for server state",
    related: ["React", "TypeScript"],
    level: 82,
  },

  {
    name: "Node.js",
    category: "backend",
    description:
      "JavaScript runtime for building scalable server-side applications",
    related: ["Express.js", "NestJS", "TypeScript"],
    level: 88,
  },
  {
    name: "NestJS",
    category: "backend",
    description: "Progressive Node.js framework for enterprise-grade APIs",
    related: ["TypeScript", "PostgreSQL", "REST APIs"],
    level: 85,
  },
  {
    name: "Express.js",
    category: "backend",
    description: "Minimal and flexible Node.js web application framework",
    related: ["Node.js", "REST APIs", "JWT Authentication"],
    level: 85,
  },
  {
    name: "REST APIs",
    category: "backend",
    description: "Architectural style for designing networked applications",
    related: ["Node.js", "Express.js", "NestJS"],
    level: 90,
  },
  {
    name: "JWT Auth",
    category: "backend",
    description: "Token-based authentication for secure API access",
    related: ["REST APIs", "Node.js"],
    level: 82,
  },
  {
    name: "WebSockets",
    category: "backend",
    description:
      "Full-duplex communication channels over a single TCP connection",
    related: ["Node.js", "Redis"],
    level: 75,
  },

  {
    name: "PostgreSQL",
    category: "database",
    description: "Advanced open-source relational database for complex queries",
    related: ["TypeORM", "NestJS"],
    level: 85,
  },
  {
    name: "MySQL",
    category: "database",
    description:
      "Widely-used open-source relational database management system",
    related: ["TypeORM"],
    level: 80,
  },
  {
    name: "MongoDB",
    category: "database",
    description: "Document-oriented NoSQL database for flexible data models",
    related: ["Node.js"],
    level: 82,
  },
  {
    name: "TypeORM",
    category: "database",
    description:
      "TypeScript ORM for Node.js with support for multiple databases",
    related: ["PostgreSQL", "MySQL", "NestJS"],
    level: 80,
  },

  {
    name: "Docker",
    category: "devops",
    description:
      "Platform for developing, shipping, and running containerized apps",
    related: ["Linux", "CI/CD"],
    level: 82,
  },
  {
    name: "Redis",
    category: "devops",
    description:
      "In-memory data store used as cache, message broker, and database",
    related: ["Docker", "WebSockets"],
    level: 78,
  },
  {
    name: "Git",
    category: "devops",
    description: "Distributed version control system for tracking code changes",
    related: ["GitHub", "CI/CD"],
    level: 90,
  },
  {
    name: "GitHub",
    category: "devops",
    description:
      "Cloud platform for version control and collaborative development",
    related: ["Git", "CI/CD"],
    level: 88,
  },
  {
    name: "Linux",
    category: "devops",
    description: "Open-source operating system for servers and development",
    related: ["Docker", "CI/CD"],
    level: 80,
  },
  {
    name: "CI/CD",
    category: "devops",
    description:
      "Automated pipeline for testing, building, and deploying software",
    related: ["Docker", "GitHub"],
    level: 78,
  },

  {
    name: "Python",
    category: "ai",
    description: "Versatile language widely used in AI, ML, and data science",
    related: ["OpenCV", "MediaPipe", "Machine Learning"],
    level: 82,
  },
  {
    name: "OpenCV",
    category: "ai",
    description: "Open-source library for real-time computer vision",
    related: ["Python", "Computer Vision"],
    level: 78,
  },
  {
    name: "MediaPipe",
    category: "ai",
    description: "Google framework for building multimodal ML pipelines",
    related: ["Python", "Computer Vision"],
    level: 75,
  },
  {
    name: "Computer Vision",
    category: "ai",
    description: "Field of AI that enables machines to interpret visual data",
    related: ["OpenCV", "MediaPipe", "CNN"],
    level: 78,
  },
  {
    name: "Machine Learning",
    category: "ai",
    description: "Algorithms that learn patterns from data to make predictions",
    related: ["Python", "CNN"],
    level: 72,
  },
  {
    name: "CNN",
    category: "ai",
    description:
      "Deep learning architecture for image recognition and analysis",
    related: ["Machine Learning", "Computer Vision"],
    level: 70,
  },
];

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  frontend: "#7fadad",
  backend: "#94c4c4",
  database: "#6b9e9e",
  devops: "#5a8a8a",
  ai: "#4a7878",
};

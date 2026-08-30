export type SkillCategory =
  | "frontend"
  | "backend"
  | "database"
  | "devops"
  | "ai"
  | "tools"
  | "other";

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
  related: string[];
  level: number;
  proficiency?: number;
  yearsOfExperience?: number;
  icon?: string;
  displayOrder?: number;
  isFeatured?: boolean;
}

export const CATEGORIES: { id: SkillCategory; label: string }[] = [
  { id: "frontend", label: "Frontend" },
  { id: "backend", label: "Backend" },
  { id: "database", label: "Databases" },
  { id: "devops", label: "DevOps" },
  { id: "ai", label: "AI & Vision" },
  { id: "tools", label: "Tools" },
  { id: "other", label: "Other" },
];

const skillsList: Omit<Skill, "id">[] = [
  // Frontend
  {
    name: "React",
    category: "frontend",
    description:
      "Component-based UI library for building interactive web applications",
    related: ["TypeScript", "Redux Toolkit", "Tailwind CSS"],
    level: 95,
    proficiency: 95,
    yearsOfExperience: 4,
    displayOrder: 1,
    isFeatured: true,
  },
  {
    name: "TypeScript",
    category: "frontend",
    description:
      "Typed superset of JavaScript for scalable, maintainable codebases",
    related: ["React", "Node.js", "NestJS"],
    level: 92,
    proficiency: 92,
    yearsOfExperience: 3.5,
    displayOrder: 2,
    isFeatured: true,
  },
  {
    name: "JavaScript",
    category: "frontend",
    description: "Core language of the web, powering both client and server",
    related: ["React", "TypeScript", "Node.js"],
    level: 93,
    proficiency: 93,
    yearsOfExperience: 5,
    displayOrder: 3,
    isFeatured: true,
  },
  {
    name: "HTML5",
    category: "frontend",
    description: "Semantic markup for accessible, SEO-friendly web pages",
    related: ["CSS3", "JavaScript"],
    level: 95,
    proficiency: 95,
    yearsOfExperience: 6,
    displayOrder: 4,
  },
  {
    name: "CSS3",
    category: "frontend",
    description:
      "Styling language for layout, animations, and responsive design",
    related: ["Tailwind CSS", "HTML5"],
    level: 90,
    proficiency: 90,
    yearsOfExperience: 6,
    displayOrder: 5,
  },
  {
    name: "Tailwind CSS",
    category: "frontend",
    description: "Utility-first CSS framework for rapid UI development",
    related: ["CSS3", "React"],
    level: 90,
    proficiency: 90,
    yearsOfExperience: 3,
    displayOrder: 6,
    isFeatured: true,
  },
  {
    name: "Redux Toolkit",
    category: "frontend",
    description: "Predictable state container for complex application logic",
    related: ["React", "TypeScript"],
    level: 85,
    proficiency: 85,
    yearsOfExperience: 2.5,
    displayOrder: 7,
  },
  {
    name: "TanStack Query",
    category: "frontend",
    description: "Powerful data synchronization and caching for server state",
    related: ["React", "TypeScript"],
    level: 85,
    proficiency: 85,
    yearsOfExperience: 2,
    displayOrder: 8,
  },
  {
    name: "React Hook Form",
    category: "frontend",
    description: "Performant forms with minimal re-renders and easy validation",
    related: ["React", "TypeScript"],
    level: 82,
    proficiency: 82,
    yearsOfExperience: 2,
    displayOrder: 9,
  },
  {
    name: "Three.js",
    category: "frontend",
    description: "JavaScript 3D library for building WebGL experiences",
    related: ["React Three Fiber", "React", "JavaScript"],
    level: 80,
    proficiency: 80,
    yearsOfExperience: 2,
    displayOrder: 10,
  },
  {
    name: "React Three Fiber",
    category: "frontend",
    description: "Declarative Three.js renderer for React applications",
    related: ["Three.js", "React"],
    level: 78,
    proficiency: 78,
    yearsOfExperience: 1.5,
    displayOrder: 11,
  },

  // Backend
  {
    name: "Node.js",
    category: "backend",
    description:
      "JavaScript runtime for building scalable server-side applications",
    related: ["Express.js", "NestJS", "TypeScript"],
    level: 88,
    proficiency: 88,
    yearsOfExperience: 4.5,
    displayOrder: 12,
    isFeatured: true,
  },
  {
    name: "Express.js",
    category: "backend",
    description: "Minimal and flexible Node.js web application framework",
    related: ["Node.js", "REST APIs", "JWT Authentication"],
    level: 85,
    proficiency: 85,
    yearsOfExperience: 3.5,
    displayOrder: 13,
  },
  {
    name: "NestJS",
    category: "backend",
    description: "Progressive Node.js framework for enterprise-grade APIs",
    related: ["TypeScript", "TypeORM", "PostgreSQL"],
    level: 87,
    proficiency: 87,
    yearsOfExperience: 3,
    displayOrder: 14,
    isFeatured: true,
  },
  {
    name: "REST APIs",
    category: "backend",
    description: "Architectural style for designing networked applications",
    related: ["Node.js", "Express.js", "NestJS"],
    level: 90,
    proficiency: 90,
    yearsOfExperience: 4,
    displayOrder: 15,
  },
  {
    name: "JWT Authentication",
    category: "backend",
    description: "Token-based authentication for secure API access",
    related: ["REST APIs", "Node.js"],
    level: 82,
    proficiency: 82,
    yearsOfExperience: 3,
    displayOrder: 16,
  },
  {
    name: "WebSockets / Real-Time Applications",
    category: "backend",
    description:
      "Full-duplex communication channels over a single TCP connection",
    related: ["Node.js", "Redis"],
    level: 80,
    proficiency: 80,
    yearsOfExperience: 2.5,
    displayOrder: 17,
  },

  // Databases & Storage
  {
    name: "PostgreSQL",
    category: "database",
    description: "Advanced open-source relational database for complex queries",
    related: ["TypeORM", "NestJS"],
    level: 87,
    proficiency: 87,
    yearsOfExperience: 3.5,
    displayOrder: 18,
    isFeatured: true,
  },
  {
    name: "MongoDB",
    category: "database",
    description: "Document-oriented NoSQL database for flexible data models",
    related: ["Node.js", "REST APIs"],
    level: 83,
    proficiency: 83,
    yearsOfExperience: 3,
    displayOrder: 19,
  },
  {
    name: "MySQL",
    category: "database",
    description:
      "Widely-used open-source relational database management system",
    related: ["TypeORM", "Node.js"],
    level: 82,
    proficiency: 82,
    yearsOfExperience: 3,
    displayOrder: 20,
  },
  {
    name: "TypeORM",
    category: "database",
    description:
      "TypeScript ORM for Node.js with support for multiple databases",
    related: ["PostgreSQL", "MySQL", "NestJS"],
    level: 84,
    proficiency: 84,
    yearsOfExperience: 3,
    displayOrder: 21,
  },
  {
    name: "Redis",
    category: "database",
    description:
      "In-memory data store used as cache, message broker, and database",
    related: ["Node.js", "WebSockets / Real-Time Applications"],
    level: 80,
    proficiency: 80,
    yearsOfExperience: 2.5,
    displayOrder: 22,
  },
  {
    name: "Firebase",
    category: "database",
    description: "Backend-as-a-service for auth, databases, and hosting",
    related: ["Node.js", "React"],
    level: 78,
    proficiency: 78,
    yearsOfExperience: 2,
    displayOrder: 23,
  },

  // DevOps & Tools
  {
    name: "Docker",
    category: "devops",
    description:
      "Platform for developing, shipping, and running containerized apps",
    related: ["Linux", "GitHub"],
    level: 84,
    proficiency: 84,
    yearsOfExperience: 3,
    displayOrder: 24,
    isFeatured: true,
  },
  {
    name: "Git",
    category: "devops",
    description: "Distributed version control system for tracking code changes",
    related: ["GitHub"],
    level: 90,
    proficiency: 90,
    yearsOfExperience: 5,
    displayOrder: 25,
  },
  {
    name: "GitHub",
    category: "devops",
    description:
      "Cloud platform for version control and collaborative development",
    related: ["Git"],
    level: 88,
    proficiency: 88,
    yearsOfExperience: 4,
    displayOrder: 26,
  },
  {
    name: "Postman",
    category: "devops",
    description: "API platform for designing, testing, and documenting APIs",
    related: ["REST APIs"],
    level: 85,
    proficiency: 85,
    yearsOfExperience: 4,
    displayOrder: 27,
  },
  {
    name: "Linux",
    category: "devops",
    description: "Open-source operating system for servers and development",
    related: ["Docker", "Git"],
    level: 80,
    proficiency: 80,
    yearsOfExperience: 4,
    displayOrder: 28,
  },
  {
    name: "Vite",
    category: "devops",
    description: "Fast development and build tool for modern web apps",
    related: ["React", "TypeScript", "Tailwind CSS"],
    level: 85,
    proficiency: 85,
    yearsOfExperience: 2.5,
    displayOrder: 29,
  },

  // AI & Vision
  {
    name: "Python",
    category: "ai",
    description: "Versatile language widely used in AI, ML, and data science",
    related: ["OpenCV", "MediaPipe", "AI / Machine Learning"],
    level: 82,
    proficiency: 82,
    yearsOfExperience: 3,
    displayOrder: 30,
  },
  {
    name: "OpenCV",
    category: "ai",
    description: "Open-source library for real-time computer vision",
    related: ["Python", "AI / Machine Learning"],
    level: 78,
    proficiency: 78,
    yearsOfExperience: 2,
    displayOrder: 31,
  },
  {
    name: "MediaPipe",
    category: "ai",
    description: "Google framework for building multimodal ML pipelines",
    related: ["Python", "AI / Machine Learning"],
    level: 76,
    proficiency: 76,
    yearsOfExperience: 1.5,
    displayOrder: 32,
  },
  {
    name: "AI / Machine Learning",
    category: "ai",
    description: "Algorithms that learn patterns from data to make predictions",
    related: ["Python", "OpenCV"],
    level: 75,
    proficiency: 75,
    yearsOfExperience: 2,
    displayOrder: 33,
  },
];

export const skills: Skill[] = skillsList.map((s) => ({
  ...s,
  id: `skill-${s.name}`,
}));

export const CATEGORY_COLORS: Record<SkillCategory, string> = {
  frontend: "#7fadad",
  backend: "#94c4c4",
  database: "#6b9e9e",
  devops: "#5a8a8a",
  ai: "#4a7878",
  tools: "#3d6b6b",
  other: "#2f5757",
};

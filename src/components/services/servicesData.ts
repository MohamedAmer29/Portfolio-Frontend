import {
  Activity,
  Boxes,
  Brain,
  Cloud,
  Code,
  Container,
  Cpu,
  Database,
  Layers,
  Monitor,
  Radio,
  Rocket,
  Server,
  ShieldCheck,
  Sparkles,
  Wrench,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export type ServiceCategory =
  | "Full Stack"
  | "Frontend"
  | "Backend"
  | "Data & Security"
  | "Infrastructure"
  | "AI";

export type ServiceEmphasis = "compact" | "standard" | "detail";

export interface Service {
  id: string;
  number: string;
  title: string;
  category: ServiceCategory;
  color: string;
  emphasis: ServiceEmphasis;
  description: string;
  technologies: string[];
  icon: LucideIcon;
  iconName?: string;
  highlights?: string[];
  details?: string[];
  groups?: { label: string; items: string[] }[];
  isFeatured?: boolean;
  displayOrder?: number;
}

const SERVICE_ICONS: Record<string, LucideIcon> = {
  Layers,
  Monitor,
  Server,
  Workflow,
  Database,
  ShieldCheck,
  Radio,
  Rocket,
  Brain,
  Code,
  Activity,
  Cloud,
  Container,
  Cpu,
  Boxes,
  Wrench,
  Sparkles,
};

export function getServiceIcon(name: string | null | undefined): LucideIcon {
  if (name && SERVICE_ICONS[name]) return SERVICE_ICONS[name];
  return Layers;
}

export const FEATURED_SERVICE: Service = {
  id: "full-stack",
  number: "01",
  title: "Full Stack Development",
  category: "Full Stack",
  color: "#456e6e",
  emphasis: "detail",
  description:
    "I build complete web applications from intuitive, accessible interfaces to scalable APIs, databases, and deployment pipelines.",
  technologies: ["React", "TypeScript", "Node.js", "NestJS", "PostgreSQL"],
  icon: Layers,
  groups: [
    { label: "Frontend", items: ["React", "TypeScript", "Tailwind CSS"] },
    { label: "Backend", items: ["Node.js", "NestJS", "Express"] },
    { label: "Database", items: ["PostgreSQL", "MongoDB", "TypeORM"] },
    { label: "DevOps", items: ["Docker", "Redis", "CI/CD"] },
  ],
  highlights: [
    "End-to-end delivery: UI, API, domain logic, and data layer.",
    "Clean architecture that stays maintainable as the product grows.",
    "Performance-focused builds with accessibility built in from the start.",
  ],
};

export const SERVICES: Service[] = [
  {
    id: "frontend",
    number: "02",
    title: "Frontend Development",
    category: "Frontend",
    color: "#38bdf8",
    emphasis: "standard",
    description:
      "Crafting responsive, accessible interfaces with modern component-based workflows and refined motion.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Redux"],
    icon: Monitor,
    highlights: [
      "Pixel-perfect UIs built from design tokens and component libraries.",
      "Performance-first rendering with lazy loading and code splitting.",
      "Responsive layouts that adapt cleanly from mobile to ultrawide.",
    ],
    details: [
      "Reusable component systems that keep UI consistent and fast to ship.",
      "Accessibility and keyboard-first interactions as first-class.",
      "Motion that enhances (and never distracts from) the experience.",
    ],
  },
  {
    id: "database",
    number: "05",
    title: "Database Design & Integration",
    category: "Data & Security",
    color: "#60a5fa",
    emphasis: "compact",
    description:
      "Schema modeling and fast, reliable persistence layers.",
    technologies: ["PostgreSQL", "MongoDB", "MySQL", "TypeORM"],
    icon: Database,
    highlights: [
      "Normalized schemas with strategic indexing for fast queries.",
      "Migrations and seed scripts that keep environments in sync.",
      "Reliable connection pooling and query optimization.",
    ],
    details: [
      "Data modeling reviews before writing a single query.",
      "Migration strategies that never lose production data.",
      "Monitoring slow queries and adding the right indexes.",
    ],
  },
  {
    id: "backend",
    number: "03",
    title: "Backend Development",
    category: "Backend",
    color: "#2dd4bf",
    emphasis: "detail",
    description:
      "Secure, scalable server-side systems with clean architecture, typed contracts, and resilient error handling.",
    technologies: ["Node.js", "NestJS", "Express", "TypeScript"],
    icon: Server,
    highlights: [
      "Modular services organized around domain boundaries.",
      "Rate limiting, validation, and resilient error handling.",
      "Observable, well-logged APIs that are easy to extend.",
    ],
  },
  {
    id: "rest-api",
    number: "04",
    title: "REST API Development",
    category: "Backend",
    color: "#2dd4bf",
    emphasis: "detail",
    description:
      "Clean, versioned REST APIs that are fast, consistent, and thoroughly documented.",
    technologies: ["Node.js", "NestJS", "Express", "OpenAPI"],
    icon: Workflow,
    highlights: [
      "Consistent resource design and versioning strategies.",
      "Validation, pagination, and structured error payloads.",
      "Documented contracts so clients integrate quickly.",
    ],
  },
  {
    id: "security",
    number: "06",
    title: "Authentication & Security",
    category: "Data & Security",
    color: "#60a5fa",
    emphasis: "compact",
    description:
      "Identity, access control, and security best practices end to end.",
    technologies: ["JWT", "OAuth 2", "bcrypt", "RBAC"],
    icon: ShieldCheck,
    highlights: [
      "Secure token storage with rotation and revocation support.",
      "Role-based access control enforced at the API layer.",
      "Input validation and rate limiting to block common attacks.",
    ],
    details: [
      "JWT flows with short-lived access and refresh tokens.",
      "OAuth 2 integration with Google, GitHub, and custom providers.",
      "Password hashing with bcrypt and optional 2FA support.",
    ],
  },
  {
    id: "real-time",
    number: "07",
    title: "Real-Time Applications",
    category: "Backend",
    color: "#2dd4bf",
    emphasis: "detail",
    description:
      "Live features such as chat, notifications, and dashboards over low-latency bidirectional flows.",
    technologies: ["WebSockets", "Socket.IO", "Redis", "SSE"],
    icon: Radio,
    highlights: [
      "Scalable connection handling with Redis-backed pub/sub.",
      "Presence, typing, and stale-event handling where needed.",
      "Graceful reconnection on flaky networks.",
    ],
  },
  {
    id: "devops",
    number: "08",
    title: "Deployment & DevOps",
    category: "Infrastructure",
    color: "#fbbf24",
    emphasis: "detail",
    description:
      "Shipping to production confidently with containerized, automated, observable pipelines.",
    technologies: ["Docker", "Redis", "Git", "CI/CD"],
    icon: Rocket,
    highlights: [
      "Dockerized services that run identically everywhere.",
      "CI/CD pipelines that build, test, and deploy automatically.",
      "Health checks and logging that keep production calm.",
    ],
  },
  {
    id: "ai-cv",
    number: "09",
    title: "AI / Computer Vision Integration",
    category: "AI",
    color: "#a855f7",
    emphasis: "detail",
    description:
      "Adding intelligence with machine learning and real-time computer vision, bridged cleanly into your web stack.",
    technologies: ["Python", "OpenCV", "MediaPipe", "Machine Learning"],
    icon: Brain,
    highlights: [
      "Real-time CV pipelines for pose, gesture, and object detection.",
      "Server-side inference endpoints that fit the API layer.",
      "Privacy-first defaults: latency, and clear failure states.",
    ],
  },
];
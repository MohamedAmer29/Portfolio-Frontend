import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  type Skill,
  type SkillCategory,
} from "../components/skills/skillsData";
import { fallbackSkills } from "../data/fallbackData";

export interface ApiSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  yearsOfExperience: number;
  icon?: string;
  description?: string;
  related: string[];
  displayOrder: number;
  isFeatured: boolean;
}

interface SkillsResponse {
  categories: string[];
  total: number;
  skillsByCategory: {
    category: string;
    count: number;
    skills: ApiSkill[];
  }[];
}

export const apiCategoryLabels: Record<SkillCategory, string> = {
  frontend: "Frontend",
  backend: "Backend",
  database: "Database",
  devops: "DevOps",
  ai: "ai",
  tools: "Tools",
  other: "Other",
};

const categoryMap: Record<string, SkillCategory> = {
  Frontend: "frontend",
  Backend: "backend",
  Database: "database",
  DevOps: "devops",
  ai: "ai",
  Tools: "tools",
  Other: "other",
};

function toSkill(s: ApiSkill): Skill {
  const proficiency = s.proficiency ?? 0;
  return {
    id: s.id,
    name: s.name,
    category: categoryMap[s.category] ?? "other",
    description: s.description ?? "",
    related: s.related ?? [],
    level: proficiency,
    proficiency,
    yearsOfExperience: s.yearsOfExperience ?? 0,
    icon: s.icon ?? "",
    displayOrder: s.displayOrder ?? 0,
    isFeatured: s.isFeatured ?? false,
  };
}

export const skillsQueryOptions = {
  queryKey: ["skills"] as const,
  queryFn: async () => {
    try {
      const { data } = await api.get<SkillsResponse>("skills");
      return data.skillsByCategory.flatMap((group) =>
        group.skills.map(toSkill),
      );
    } catch {
      return fallbackSkills;
    }
  },
  retry: 1,
};

export function useSkills() {
  return useQuery(skillsQueryOptions);
}

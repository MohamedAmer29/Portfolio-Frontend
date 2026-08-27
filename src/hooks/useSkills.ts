import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  type Skill,
  type SkillCategory,
} from "../components/skills/skillsData";

interface ApiSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  description: string;
  related: string[];
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

function toSkill(s: ApiSkill): Skill {
  return {
    id: s.id,
    name: s.name,
    category: s.category.toLowerCase() as SkillCategory,
    description: s.description,
    related: s.related ?? [],
    level: s.proficiency,
  };
}

export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      const { data } = await api.get<SkillsResponse>("skills");
      return data.skillsByCategory.flatMap((group) =>
        group.skills.map(toSkill),
      );
    },
    retry: 1,
  });
}
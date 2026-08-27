import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Project } from "../components/sections/Projects";

interface ApiTechnology {
  id: string;
  name: string;
  category?: string;
  icon?: string | null;
}

interface ApiProject {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  image: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: string;
  displayOrder: number;
  startDate: string | null;
  endDate: string | null;
  technologies: ApiTechnology[];
  tech: string[];
  github: string;
  external: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data } = await api.get<ApiProject[]>("projects");
      return data
        .map(
          (item): Project => ({
            title: item.title,
            slug: item.slug,
            shortDescription: item.shortDescription,
            description: item.description || item.shortDescription,
            image: item.image,
            githubUrl: item.githubUrl,
            liveUrl: item.liveUrl,
            featured: item.featured,
            status: item.status,
            displayOrder: item.displayOrder,
            startDate: item.startDate,
            endDate: item.endDate,
            technologies: item.technologies.map((t) => ({
              name: t.name,
              category: t.category,
              icon: t.icon,
            })),
            tech:
              item.tech.length > 0
                ? item.tech
                : item.technologies.map((t) => t.name),
            github: item.githubUrl ?? (item.github || "#"),
            external: item.liveUrl ?? (item.external || "#"),
          }),
        )
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0));
    },
    retry: 1,
  });
}
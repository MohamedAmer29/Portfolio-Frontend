import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import {
  getServiceIcon,
  type Service,
  type ServiceCategory,
  type ServiceEmphasis,
} from "../components/services/servicesData";
import { fallbackServices } from "../data/fallbackData";

interface ApiServiceGroup {
  label: string;
  items: string[];
}

interface ApiService {
  createdAt: string;
  updatedAt: string;
  id: string;
  title: string | null;
  description: string | null;
  icon: string | null;
  number: string | null;
  category: string | null;
  color: string | null;
  emphasis: string | null;
  technologies: string[] | null;
  groups: ApiServiceGroup[] | null;
  highlights: string[] | null;
  displayOrder: number;
  isFeatured: boolean;
}

export function toService(item: ApiService): Service {
  return {
    id: item.id,
    number: item.number ?? "",
    title: item.title ?? "Service",
    category: (item.category ?? "Full Stack") as ServiceCategory,
    color: item.color ?? "#456e6e",
    emphasis: (item.emphasis ?? "standard") as ServiceEmphasis,
    description: item.description ?? "",
    technologies: item.technologies ?? [],
    icon: getServiceIcon(item.icon),
    iconName: item.icon ?? "Layers",
    groups: item.groups ?? [],
    highlights: item.highlights ?? [],
    isFeatured: item.isFeatured,
    displayOrder: item.displayOrder,
  };
}

export const servicesQueryOptions = {
  queryKey: ["services"] as const,
  queryFn: async () => {
    try {
      const { data } = await api.get<ApiService[]>("services");
      return [...data]
        .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
        .map(toService);
    } catch {
      return fallbackServices;
    }
  },
  retry: false,
  placeholderData: [],
};

export function useServices() {
  return useQuery(servicesQueryOptions);
}

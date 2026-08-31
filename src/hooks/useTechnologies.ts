import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { fallbackTechnologies } from "../data/fallbackData";

export interface Technology {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

export const technologiesQueryOptions = {
  queryKey: ["technologies"] as const,
  queryFn: async () => {
    try {
      const { data } = await api.get<Technology[]>("technologies");
      return data;
    } catch {
      return fallbackTechnologies;
    }
  },
  retry: 1,
};

export function useTechnologies() {
  return useQuery(technologiesQueryOptions);
}

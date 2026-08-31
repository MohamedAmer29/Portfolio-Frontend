import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Job } from "../components/sections/Experience";
import { fallbackExperience } from "../data/fallbackData";

interface ApiExperience {
  id: string;
  company: string;
  position: string;
  description: string[];
  location: string | null;
  employmentType: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  displayOrder: number;
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "Present";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const experienceQueryOptions = {
  queryKey: ["experience"] as const,
  queryFn: async () => {
    try {
      const { data } = await api.get<ApiExperience[]>("experience");
      return data.map(
        (item): Job => ({
          id: item.id,
          company: item.company,
          title: item.position,
          range: `${formatDate(item.startDate)} \u2014 ${
            item.isCurrent ? "Present" : formatDate(item.endDate)
          }`,
          url: "",
          bullets: item.description,
          position: item.position,
          location: item.location ?? "",
          employmentType: item.employmentType,
          startDate: item.startDate,
          endDate: item.endDate ?? "",
          isCurrent: item.isCurrent,
          displayOrder: item.displayOrder,
        }),
      );
    } catch {
      return fallbackExperience;
    }
  },
  retry: 1,
};

export function useExperience() {
  return useQuery(experienceQueryOptions);
}

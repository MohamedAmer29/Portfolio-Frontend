import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface AboutTechnology {
  createdAt: string;
  updatedAt: string;
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

export interface AboutMeData {
  createdAt: string;
  updatedAt: string;
  id: string;
  sentences: string[];
  technologyIds: string[];
  image: string;
  technologies: AboutTechnology[];
}

export const aboutMeQueryOptions = {
  queryKey: ["about-me"] as const,
  queryFn: async () => {
    const { data } = await api.get<AboutMeData>("about-me");
    return data;
  },
  retry: 1,
};

export function useAboutMe() {
  return useQuery(aboutMeQueryOptions);
}
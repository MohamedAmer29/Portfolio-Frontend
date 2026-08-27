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
  image: string;
  technologies: AboutTechnology[];
}

export function useAboutMe() {
  return useQuery({
    queryKey: ["about-me"],
    queryFn: async () => {
      const { data } = await api.get<AboutMeData>("about-me");
      return data;
    },
    retry: 1,
  });
}
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface HeroData {
  fullName: string;
  bio: string;
  description: string;
}

export function useHero() {
  return useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data } = await api.get<HeroData>("hero");
      return data;
    },
    retry: 1,
  });
}
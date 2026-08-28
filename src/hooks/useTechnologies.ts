import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface Technology {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

export function useTechnologies() {
  return useQuery({
    queryKey: ["technologies"],
    queryFn: async () => {
      const { data } = await api.get<Technology[]>("technologies");
      return data;
    },
    retry: 1,
  });
}
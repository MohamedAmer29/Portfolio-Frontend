import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Technology } from "./useTechnologies";

export type TechnologyInput = {
  name: string;
  category: string;
  icon: string;
};

export function useCreateTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TechnologyInput) => {
      const { data: result } = await api.post<Technology>("technologies", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });
}

export function useUpdateTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: TechnologyInput }) => {
      const { data: result } = await api.patch<Technology>(
        `technologies/${id}`,
        data,
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });
}

export function useDeleteTechnology() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`technologies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technologies"] });
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });
}
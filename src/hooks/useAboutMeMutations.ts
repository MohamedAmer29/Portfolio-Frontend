import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { AboutMeData } from "./useAboutMe";

export function useAboutMeMutations() {
  const queryClient = useQueryClient();

  const upsertAboutImage = useMutation({
    mutationFn: async (formData: FormData) => {
      const { data: result } = await api.post<AboutMeData>("about-me/image", formData);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["about-me"], data);
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });

  const updateAboutMe = useMutation({
    mutationFn: async (data: { sentences: string[]; technologyIds: string[] }) => {
      const { data: result } = await api.patch<AboutMeData>("about-me", data);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["about-me"], data);
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });

  const createAboutMe = useMutation({
    mutationFn: async (data: { sentences: string[]; technologyIds: string[] }) => {
      const { data: result } = await api.post<AboutMeData>("about-me", data);
      return result;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["about-me"], data);
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });

  const deleteAboutMe = useMutation({
    mutationFn: async () => {
      await api.delete("about-me");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-me"] });
    },
  });

  return { upsertAboutImage, updateAboutMe, createAboutMe, deleteAboutMe };
}

export const DEFAULT_ABOUT_BODY = {
  sentences: [
    "I'm a full-stack developer who enjoys building thoughtful, performant products.",
    "I care about clean architecture, accessible interfaces, and shipping things that work.",
  ],
  technologyIds: [],
};
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import type { HeroData } from "./useHero";

export const DEFAULT_HERO_BODY: HeroData = {
  fullName: "Your Name",
  bio: "I build things for the web.",
  description:
    "A short introduction about who you are and what you do.",
};

export function useCreateHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HeroData) => {
      const { data: result } = await api.post<HeroData>("hero", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
    },
    onError: () => {
      toast.error("Could not create hero.");
    },
  });
}

export function useUpdateHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: HeroData) => {
      const { data: result } = await api.patch<HeroData>("hero", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
    },
    onError: () => {
      toast.error("Could not update hero.");
    },
  });
}

export function useDeleteHero() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.delete("hero");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hero"] });
    },
    onError: () => {
      toast.error("Could not delete hero.");
    },
  });
}
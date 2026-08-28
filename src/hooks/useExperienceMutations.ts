import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";
import type { Job } from "../components/sections/Experience";

export type ExperienceInput = {
  company: string;
  position: string;
  description: string[];
  location: string;
  employmentType: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  displayOrder: number;
};

export const DEFAULT_EXPERIENCE_BODY: ExperienceInput = {
  company: "Company Name",
  position: "Job Title",
  description: ["Describe your role and achievements."],
  location: "Remote",
  employmentType: "FULL_TIME",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: undefined,
  isCurrent: true,
  displayOrder: 0,
};

export function useCreateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExperienceInput) => {
      const { data: result } = await api.post<Job>("experience", data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
    onError: () => {
      toast.error("Could not add experience.");
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ExperienceInput }) => {
      const { data: result } = await api.patch<Job>(`experience/${id}`, data);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
    onError: () => {
      toast.error("Could not update experience.");
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`experience/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["experience"] });
    },
    onError: () => {
      toast.error("Could not delete experience.");
    },
  });
}

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";

export interface ServiceInput {
  title: string;
  description: string;
  icon?: string;
  number?: string;
  category?: string;
  color?: string;
  emphasis?: string;
  technologies?: string[];
  groups?: { label: string; items: string[] }[];
  highlights?: string[];
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface ServicePatch {
  title?: string;
  description?: string;
  icon?: string;
  number?: string;
  category?: string;
  color?: string;
  emphasis?: string;
  technologies?: string[];
  groups?: { label: string; items: string[] }[];
  highlights?: string[];
  displayOrder?: number;
  isFeatured?: boolean;
}

export function useServicesMutations() {
  const queryClient = useQueryClient();

  const updateService = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: ServicePatch;
    }) => {
      const { data } = await api.patch<unknown>(`services/${id}`, patch);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: () => {
      toast.error("Could not save service changes.");
    },
  });

  const createService = useMutation({
    mutationFn: async (body: ServiceInput) => {
      const { data } = await api.post<unknown>("services", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: () => {
      toast.error("Could not add service.");
    },
  });

  const deleteService = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<unknown>(`services/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
    onError: () => {
      toast.error("Could not delete service.");
    },
  });

  return { updateService, createService, deleteService };
}

export const DEFAULT_SERVICE_BODY: ServiceInput = {
  title: "Backend Development",
  description: "I build scalable REST and GraphQL APIs...",
  icon: "server-icon",
  number: "01",
  category: "Full Stack",
  color: "#456e6e",
  emphasis: "detail",
  technologies: ["React", "NestJS"],
  groups: [{ label: "Frontend", items: ["React", "TypeScript"] }],
  highlights: ["Clean architecture that scales."],
  displayOrder: 0,
  isFeatured: false,
};

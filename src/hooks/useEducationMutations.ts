import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";

export interface EducationInput {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  description?: string;
  coursework?: string[];
  achievements?: string[];
  academicFocus?: string[];
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  displayOrder?: number;
}

interface EducationPatch {
  institution?: string;
  degree?: string;
  fieldOfStudy?: string;
  description?: string;
  coursework?: string[];
  achievements?: string[];
  academicFocus?: string[];
  location?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}

export function useEducationMutations() {
  const queryClient = useQueryClient();

  const updateEducation = useMutation({
    mutationFn: async ({ id, patch }: { id: string; patch: EducationPatch }) => {
      const { data } = await api.patch<unknown>(`education/${id}`, patch);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
    onError: () => {
      toast.error("Could not save education changes.");
    },
  });

  const createEducation = useMutation({
    mutationFn: async (body: EducationInput) => {
      const { data } = await api.post<unknown>("education", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
    onError: () => {
      toast.error("Could not add education entry.");
    },
  });

  const deleteEducation = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<unknown>(`education/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["education"] });
    },
    onError: () => {
      toast.error("Could not delete education entry.");
    },
  });

  return { updateEducation, createEducation, deleteEducation };
}

export const DEFAULT_EDUCATION_BODY: EducationInput = {
  institution: "University of Example",
  degree: "B.Sc. Computer Science",
  fieldOfStudy: "Software Engineering",
  description: "Studied algorithms and systems...",
  coursework: ["Software Engineering"],
  achievements: ["Dean's List"],
  academicFocus: ["Algorithms"],
  location: "Boston, MA",
  startDate: "2018",
  endDate: "2022",
  isCurrent: false,
  displayOrder: 0,
};

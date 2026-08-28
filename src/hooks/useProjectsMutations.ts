import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { api } from "../lib/api";

export interface ProjectDraft {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  status: string;
  displayOrder: number;
  startDate: string;
  endDate: string;
  technologies: string[];
  image: string | null;
}

export interface ProjectInput {
  title: string;
  slug: string;
  shortDescription: string;
  description: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: string;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
}

interface ProjectPatch {
  title?: string;
  slug?: string;
  shortDescription?: string;
  description?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  status?: string;
  displayOrder?: number;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
}

function toPatch(draft: ProjectDraft): ProjectPatch {
  return {
    title: draft.title,
    slug: draft.slug,
    shortDescription: draft.shortDescription,
    description: draft.description,
    githubUrl: draft.githubUrl,
    liveUrl: draft.liveUrl,
    featured: draft.featured,
    status: draft.status,
    displayOrder: draft.displayOrder,
    startDate: draft.startDate,
    endDate: draft.endDate,
    technologies: draft.technologies,
  };
}

export function useProjectsMutations() {
  const queryClient = useQueryClient();

  const updateProject = useMutation({
    mutationFn: async ({
      id,
      patch,
    }: {
      id: string;
      patch: ProjectPatch;
    }) => {
      const { data } = await api.patch<unknown>(`projects/${id}`, patch);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Could not save project changes.");
    },
  });

  const createProject = useMutation({
    mutationFn: async (body: ProjectInput) => {
      const { data } = await api.post<unknown>("projects", body);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Could not add project.");
    },
  });

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<unknown>(`projects/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Could not delete project.");
    },
  });

  const uploadProjectImage = useMutation({
    mutationFn: async ({
      id,
      file,
      hasImage,
    }: {
      id: string;
      file: File;
      hasImage: boolean;
    }) => {
      const form = new FormData();
      form.append("image", file);
      if (hasImage) {
        const { data } = await api.patch<{ image: string }>(
          `projects/${id}/image`,
          form,
        );
        return data;
      }
      const { data } = await api.post<{ image: string }>(
        `projects/${id}/image`,
        form,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: () => {
      toast.error("Could not upload image.");
    },
  });

  return { updateProject, createProject, deleteProject, uploadProjectImage };
}

export const DEFAULT_PROJECT_BODY: ProjectInput = {
  title: "Portfolio API",
  slug: "portfolio-api",
  shortDescription: "A short summary of the project",
  description: "Full project description...",
  githubUrl: "https://github.com/me/project",
  liveUrl: "https://project.example.com",
  featured: false,
  status: "PLANNING",
  displayOrder: 0,
  startDate: "2024-01-01",
  endDate: "2024-06-01",
  technologies: [],
};

export { toPatch };

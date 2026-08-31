import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { aboutMeQueryOptions } from "./useAboutMe";
import { educationQueryOptions } from "./useEducation";
import { experienceQueryOptions } from "./useExperience";
import { heroQueryOptions } from "./useHero";
import { projectsQueryOptions } from "./useProjects";
import { servicesQueryOptions } from "./useServices";
import { skillsQueryOptions } from "./useSkills";
import { technologiesQueryOptions } from "./useTechnologies";

export function usePrefetchContent() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetch = () => {
      void queryClient.prefetchQuery(aboutMeQueryOptions);
      void queryClient.prefetchQuery(educationQueryOptions);
      void queryClient.prefetchQuery(experienceQueryOptions);
      void queryClient.prefetchQuery(heroQueryOptions);
      void queryClient.prefetchQuery(projectsQueryOptions);
      void queryClient.prefetchQuery(servicesQueryOptions);
      void queryClient.prefetchQuery(skillsQueryOptions);
      void queryClient.prefetchQuery(technologiesQueryOptions);
    };

    const ric = (window as unknown as {
      requestIdleCallback?(
        cb: () => void,
        options?: { timeout?: number },
      ): number;
      cancelIdleCallback?(id: number): void;
    });
    if (ric.requestIdleCallback) {
      const id = ric.requestIdleCallback(prefetch, { timeout: 3000 });
      return () => ric.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(prefetch, 1500);
    return () => window.clearTimeout(id);
  }, [queryClient]);
}
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
    void queryClient.prefetchQuery(aboutMeQueryOptions);
    void queryClient.prefetchQuery(educationQueryOptions);
    void queryClient.prefetchQuery(experienceQueryOptions);
    void queryClient.prefetchQuery(heroQueryOptions);
    void queryClient.prefetchQuery(projectsQueryOptions);
    void queryClient.prefetchQuery(servicesQueryOptions);
    void queryClient.prefetchQuery(skillsQueryOptions);
    void queryClient.prefetchQuery(technologiesQueryOptions);
  }, [queryClient]);
}
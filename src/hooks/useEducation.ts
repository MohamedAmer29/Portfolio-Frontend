import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Education } from "../components/education/educationData";
import {
  fallbackEducation,
  type FallbackEducation,
} from "../data/fallbackData";

interface ApiEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  description: string;
  coursework: string[];
  achievements: string[];
  academicFocus: string[];
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  displayOrder: number;
}

interface EducationData {
  entries: Education[];
  academicFocus: string[];
}

function mapFallbackEducation(item: FallbackEducation): Education {
  return {
    id: item.id,
    institution: item.institution,
    degree: item.degree,
    field: item.fieldOfStudy,
    startDate: item.startDate,
    endDate: item.isCurrent ? "Present" : item.endDate,
    location: item.location,
    description: item.description,
    coursework: item.coursework,
    achievements: item.achievements,
    displayOrder: item.displayOrder,
  };
}

export function mapEducation(item: ApiEducation): Education {
  return {
    id: item.id,
    institution: item.institution,
    degree: item.degree,
    field: item.fieldOfStudy,
    startDate: item.startDate,
    endDate: item.isCurrent ? "Present" : item.endDate,
    location: item.location,
    description: item.description,
    coursework: item.coursework,
    achievements: item.achievements,
    displayOrder: item.displayOrder,
  };
}

export const educationQueryOptions = {
  queryKey: ["education"] as const,
  queryFn: async () => {
    try {
      const { data } = await api.get<ApiEducation[]>("education");
      const entries: Education[] = data.map(mapEducation);
      const academicFocus = data[0]?.academicFocus ?? [];
      return { entries, academicFocus } satisfies EducationData;
    } catch {
      const entries = fallbackEducation.map(mapFallbackEducation);
      const academicFocus =
        fallbackEducation[0]?.academicFocus ?? [];
      return { entries, academicFocus } satisfies EducationData;
    }
  },
  retry: 1,
};

export function useEducation() {
  return useQuery(educationQueryOptions);
}

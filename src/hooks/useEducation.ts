import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { Education } from "../components/education/educationData";

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

export function useEducation() {
  return useQuery({
    queryKey: ["education"],
    queryFn: async () => {
      const { data } = await api.get<ApiEducation[]>("education");
      const entries: Education[] = data.map(mapEducation);
      const academicFocus = data[0]?.academicFocus ?? [];
      return { entries, academicFocus } satisfies EducationData;
    },
    retry: 1,
  });
}
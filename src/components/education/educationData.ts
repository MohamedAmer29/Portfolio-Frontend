export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  location?: string;
  description?: string;
  coursework?: string[];
  achievements?: string[];
  logo?: string;
}

export const education: Education[] = [
  {
    id: "bachelor",
    institution: "University Name",
    degree: "Bachelor's Degree",
    field: "Computer Science",
    startDate: "2022",
    endDate: "2026",
    location: "City, Country",
    description:
      "Studying computer science with a focus on software engineering, algorithms, and web development.",
    coursework: [
      "Software Engineering",
      "Database Systems",
      "Algorithms & Data Structures",
      "Web Development",
      "Computer Networks",
      "Artificial Intelligence",
    ],
    achievements: [],
  },
];

export const academicFocus = [
  "Software Engineering",
  "Database Systems",
  "Algorithms",
  "Web Development",
  "Computer Networks",
  "Artificial Intelligence",
];

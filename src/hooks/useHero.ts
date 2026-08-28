import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export interface HeroData {
  fullName: string;
  bio: string;
  description: string;
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
  }
  return "";
}

function normalizeHeroData(data: unknown): HeroData | null {
  if (!data || typeof data !== "object") return null;

  const record = data as Record<string, unknown>;
  const source =
    record.fullName !== undefined ||
    record.full_name !== undefined ||
    record.name !== undefined ||
    record.bio !== undefined ||
    record.tagline !== undefined ||
    record.description !== undefined
      ? record
      : typeof record.data === "object" && record.data
        ? (record.data as Record<string, unknown>)
        : typeof record.hero === "object" && record.hero
          ? (record.hero as Record<string, unknown>)
          : record;

  const fullName = pickString(
    source.fullName,
    source.full_name,
    source.name,
    source.title,
  );
  const bio = pickString(source.bio, source.tagline, source.headline);
  const description = pickString(
    source.description,
    source.summary,
    source.about,
  );

  if (!fullName && !bio && !description) {
    return null;
  }

  return { fullName, bio, description };
}

export function useHero() {
  return useQuery({
    queryKey: ["hero"],
    queryFn: async () => {
      const { data } = await api.get<unknown>("hero");
      return normalizeHeroData(data);
    },
    retry: 1,
  });
}

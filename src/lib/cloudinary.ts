export function optimizeCloudinaryUrl(
  url: string | null | undefined,
  width = 1200,
): string | null {
  if (!url) return null;
  if (!url.includes("cloudinary.com")) return url;
  return url.replace(
    "/upload/",
    `/upload/w_${width},c_limit,f_auto,q_auto/`,
  );
}

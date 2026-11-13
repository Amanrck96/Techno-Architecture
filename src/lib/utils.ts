import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

/**
 * Returns optimized ~20 KB 400px thumbnail path for project & team images in grids/lists
 */
export function getThumbnailUrl(url: string): string {
  if (!url || typeof url !== "string") return url || "";
  if (url.endsWith("-thumb.webp")) return url;
  if (url.endsWith(".webp") && (url.startsWith("/projects/") || url.startsWith("/team/"))) {
    return url.replace(/\.webp$/i, "-thumb.webp");
  }
  return url;
}

export const FALLBACK = "/images/fallback-product.svg";

/**
 * Normalises image values without proxying valid absolute URLs.
 */
export function getImageSrc(src) {
  if (!src || typeof src !== "string" || src.trim() === "") return FALLBACK;

  const normalised = src.replace(/\\/g, "/").trim();

  // Relative /uploads path — optionally prepend backend base URL
  if (normalised.startsWith("/uploads") || normalised.startsWith("uploads/")) {
    const path = normalised.startsWith("/") ? normalised : `/${normalised}`;
    const base = (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "";
    if (base) return base.replace(/\/$/, "") + path;
    return path;
  }

  // Keep valid absolute URLs intact. ProductImage handles failed hosts locally.
  if (/^https?:\/\//i.test(normalised)) return normalised;

  return normalised;
}

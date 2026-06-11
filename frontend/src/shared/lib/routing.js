/**
 * OMNIA — App resolver: which sub-app to render based on the current URL.
 * In dev (Emergent preview) we use path prefixes /cloud/, /app/, /learn/.
 * In production a reverse proxy will map subdomains to the same paths.
 */
export const APPS = {
  LANDING: "landing",
  IMMOCLOUD: "immocloud",
  IMMOWEB: "immoweb",
  ACADEMY: "academy",
};

/**
 * Returns the current app based on URL pathname.
 * URL pattern: /{lang?}/{app}/...   OR   /{app}/...   OR   /
 */
export function resolveAppFromPath(pathname) {
  const parts = pathname.replace(/^\//, "").split("/").filter(Boolean);
  // strip language prefix if present (it|en|es)
  if (parts.length > 0 && ["it", "en", "es"].includes(parts[0])) {
    parts.shift();
  }
  const first = parts[0];
  switch (first) {
    case "cloud":
      return APPS.IMMOCLOUD;
    case "app":
      return APPS.IMMOWEB;
    case "learn":
      return APPS.ACADEMY;
    default:
      return APPS.LANDING;
  }
}

/**
 * Returns the language from URL path, or null if not present.
 */
export function resolveLangFromPath(pathname) {
  const parts = pathname.replace(/^\//, "").split("/").filter(Boolean);
  if (parts.length > 0 && ["it", "en", "es"].includes(parts[0])) {
    return parts[0];
  }
  return null;
}

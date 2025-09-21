/**
 * URL utilities for consistent trailing slash handling in GitHub Pages
 */

/**
 * Normalizes a URL path to have a trailing slash for GitHub Pages compatibility
 * @param path - The URL path to normalize
 * @returns The normalized path with trailing slash (except for root)
 */
export function normalizeUrlPath(path: string): string {
  // Root path stays as is
  if (path === '/') {
    return path;
  }
  
  // Add trailing slash if not present
  if (!path.endsWith('/')) {
    return path + '/';
  }
  
  return path;
}

/**
 * Checks if two paths are the same when normalized
 * @param path1 - First path to compare
 * @param path2 - Second path to compare
 * @returns True if paths are equivalent when normalized
 */
export function pathsMatch(path1: string, path2: string): boolean {
  return normalizeUrlPath(path1) === normalizeUrlPath(path2);
}

/**
 * Checks if a current path starts with a base path (useful for active link detection)
 * @param currentPath - The current pathname
 * @param basePath - The base path to check against
 * @returns True if currentPath starts with basePath when both are normalized
 */
export function pathStartsWith(currentPath: string, basePath: string): boolean {
  if (basePath === '/') {
    return currentPath === '/';
  }
  
  const normalizedCurrent = normalizeUrlPath(currentPath);
  const normalizedBase = normalizeUrlPath(basePath);
  
  return normalizedCurrent.startsWith(normalizedBase);
}

/**
 * Constructs a full URL with base URL and normalized path
 * @param basePath - The base URL (e.g., https://example.com)
 * @param path - The path to append
 * @returns Full URL with normalized path
 */
export function buildFullUrl(baseUrl: string, path: string): string {
  const normalizedPath = normalizeUrlPath(path);
  
  if (normalizedPath === '/') {
    return baseUrl;
  }
  
  return `${baseUrl.replace(/\/$/, '')}${normalizedPath}`;
}
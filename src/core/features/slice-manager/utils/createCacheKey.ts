export function createCacheKey(
  sliceName: string,
  operation: string,
  params?: Record<string, unknown>
): string {
  if (params && Object.keys(params).length > 0) {
    const paramString = Object.entries(params)
      .sort(([a], [b]) => a.localeCompare(b)) // Sort for consistent keys
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('&');
    return `${sliceName}:${operation}:${paramString}`;
  }
  return `${sliceName}:${operation}`;
}

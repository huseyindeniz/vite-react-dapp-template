export interface CacheStats {
  totalEntries: number;
  totalSize: number;
  expiredEntries: number;
  sliceBreakdown: Record<string, number>;
}

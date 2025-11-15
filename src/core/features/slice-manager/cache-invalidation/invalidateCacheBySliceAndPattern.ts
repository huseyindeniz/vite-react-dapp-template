import { invalidateCachePattern } from './invalidateCachePattern';

export function invalidateCacheBySliceAndPattern(
  sliceName: string,
  keyPattern: string
): void {
  const pattern = new RegExp(`^${sliceName}:.*${keyPattern}.*`);
  invalidateCachePattern(pattern);
}

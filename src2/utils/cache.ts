import { CacheType } from '../types';
import { compareArrays } from './compareArrays';

export function cacheRead(
  cache: CacheType,
  topLevelArgs: any[],
  localArgs: any[]
): [number, number, any] {
  let record = null;

  const globalIndex = cache.findIndex(([args]) =>
    compareArrays(args, topLevelArgs)
  );

  let localIndex = -1;
  if (globalIndex > -1) {
    localIndex = cache[globalIndex][1].findIndex(([args]) =>
      compareArrays(args, localArgs)
    );
  }

  if (localIndex > -1) {
    record = cache[globalIndex][1][localIndex][1];
  }

  return [globalIndex, localIndex, record];
}

export function cacheWrite(
  cache: CacheType,
  globalIndex: number,
  topLevelArgs: any[],
  localArgs: any[],
  record: any
) {
  // Save to cache...
  if (globalIndex === -1) {
    globalIndex = cache.push([topLevelArgs, []]) - 1;
  }

  cache[globalIndex][1].push([localArgs, record]);
}

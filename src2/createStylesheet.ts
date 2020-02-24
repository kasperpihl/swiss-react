import { TopLevelStyler, StyleSheetObject } from './types';

export function createStylesheet<TopArgs extends any[], SSheet>(
  name: string,
  topLevelStyler: TopLevelStyler<TopArgs, SSheet>
): StyleSheetObject<TopArgs, SSheet> {
  return {
    __isStylesheet: true,
    symbol: Symbol(name),
    name,
    cache: [],
    uniqueCounter: 0,
    topLevelStyler
  };
}

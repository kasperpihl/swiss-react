import {
  TopLevelStyleFunction,
  StyleSheetObject,
  TopLevelStylesObject
} from './types';

export function createStyles<
  TopArgs extends any[],
  SSheet extends TopLevelStylesObject
>(
  name: string,
  topLevelStyleFunction: TopLevelStyleFunction<TopArgs, SSheet>
): StyleSheetObject<TopArgs, SSheet> {
  return {
    __isStylesheet: true,
    symbol: Symbol(name),
    name,
    uniqueCounter: 0,
    cache: {},
    topLevelStyleFunction
  };
}

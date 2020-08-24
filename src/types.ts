import { PropertiesFallback } from 'csstype';
import type { createStyles } from './createStyles';

export interface CSSObject extends PropertiesFallback {
  [key: string]:
    | string
    | number
    | (string | number)[]
    | PropertiesFallback
    | CSSObject
    | undefined;
}

export type TopLevelStylesObject = {
  [key: string]: CSSObject | ((...args: any[]) => CSSObject);
};

export type TopLevelStyleFunction<
  TopArgs extends any[],
  SSheet extends TopLevelStylesObject
> = (...args: TopArgs) => SSheet;

export type StyleSheetObject<
  TopArgs extends any[],
  SSheet extends TopLevelStylesObject
> = {
  __isStylesheet: true;
  uniqueCounter: number;
  symbol: symbol;
  name: string;
  cache: CacheType;
  topLevelStyleFunction: TopLevelStyleFunction<TopArgs, SSheet>;
};

export type AsClassNameObject<
  T extends ReturnType<typeof createStyles>,
  Return
> = {
  [P in keyof ReturnType<T['topLevelStyleFunction']>]: (
    ...lowLevelArgs: ReturnType<T['topLevelStyleFunction']>[P] extends (
      ...args: any[]
    ) => CSSObject
      ? Parameters<ReturnType<T['topLevelStyleFunction']>[P]>
      : never[]
  ) => Return;
};

/**
 * Internal parsing types
 */

export type CacheType = {
  [key: string]: [any[], [any[], string][]][];
};

export type StyleObjectNode = {
  type: 'node';
  property: string;
  value?: string | number;
};
export type StyleObjectSelector = {
  type: 'selector';
  property: string;
  value: StyleObjectArray;
  mediaQuery?: string;
};

export type StyleObjectArray = Array<StyleObjectNode | StyleObjectSelector>;

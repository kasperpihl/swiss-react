import { PropertiesFallback } from 'csstype';

export type CacheType = [any[], [any[], string][]][];

export type Tail<T extends any[]> = ((...args: T) => void) extends (
  head: any,
  ...tail: infer U
) => any
  ? U
  : never;

export type StyleFunction<ReturnType> = <LocalArgs extends any[] = []>(
  localStyler: PropertiesFallback | ((...rest: LocalArgs) => PropertiesFallback)
) => (...args: LocalArgs) => ReturnType;

export type TopLevelStyler<TopArgs extends any[], SSheet> = (
  options: {
    css: StyleFunction<string>;
    inline: StyleFunction<object>;
    theme: any;
    condition: (condition: boolean | string | number) => string;
  },
  ...rest: TopArgs
) => SSheet;

export type StyleSheetObject<TopArgs extends any[], SSheet> = {
  __isStylesheet: true;
  uniqueCounter: number;
  symbol: symbol;
  name: string;
  cache: CacheType;
  topLevelStyler: TopLevelStyler<TopArgs, SSheet>;
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

import { PropertiesFallback } from 'csstype';
import { createStylesheet } from './createStylesheet';
import { condition, BLOCK_KEY } from './utils/condition';
import { useMemo, useEffect } from 'react';
import { Tail, StyleObjectArray } from './types';
import { parseInline } from './parsers/inline';
import { parseCss } from './parsers/css';
import { convertStylesToArray } from './utils/convertStylesToArray';
import { cacheRead, cacheWrite } from './utils/cache';
import { useStyleContext } from './utils/StyleContext';

export function useStylesheet<T extends ReturnType<typeof createStylesheet>>(
  styleSheet: T,
  ...topLevelArgs: Tail<Parameters<T['topLevelStyler']>>
) {
  const styleContext = useStyleContext();
  const name = styleContext.getUniqueClassName(
    styleSheet.symbol,
    styleSheet.name
  );
  useEffect(() => {
    styleContext.didRender();
  });

  const createStyler = <T, LocalArgs extends any[]>(
    modifier: (styleArray: StyleObjectArray, displayName: string) => T
  ) => (localStyler: (...rest: LocalArgs) => PropertiesFallback) => {
    // Using standard function because we use bind to determine className.
    return function(...localArgs: LocalArgs) {
      const displayName = this;

      let [globalIndex, , record] = cacheRead(
        styleSheet.cache,
        topLevelArgs,
        localArgs
      );

      if (record) return record as T;

      const styleObject =
        typeof localStyler === 'function'
          ? localStyler(...localArgs)
          : localStyler;

      // Delete any conditions that were not met
      delete styleObject[BLOCK_KEY];

      const styleArray = convertStylesToArray(styleObject);
      // Call unique implementations to do their stuff (native, css, inline)..
      record = modifier(
        styleArray,
        `sw-${displayName}-${styleSheet.uniqueCounter++}`
      );

      cacheWrite(
        styleSheet.cache,
        globalIndex,
        topLevelArgs,
        localArgs,
        record
      );

      return record as T;
    };
  };

  const css = createStyler((styleArray, className) => {
    const rawCss = parseCss(styleArray, className);
    styleContext.appendCss(rawCss);
    return className;
  });
  const inline = createStyler(styleArray => parseInline(styleArray));

  return useMemo<ReturnType<T['topLevelStyler']>>(() => {
    const styleObject = styleSheet.topLevelStyler(
      {
        css,
        inline,
        condition,
        theme: undefined
      },
      ...topLevelArgs
    ) as any;

    Object.entries(styleObject).forEach(([key, func]: [string, Function]) => {
      styleObject[key] = func.bind(`${name}_${key}`);
    });
    return styleObject;
  }, topLevelArgs);
}

import { BLOCK_KEY } from './condition';
import { useMemo, useLayoutEffect } from 'react';
import { AsClassNameObject } from './types';
import { parseCss } from './parsers/css';
import { convertStylesToArray } from './utils/convertStylesToArray';
import { cacheRead, cacheWrite } from './utils/cache';
import { useStyleContext } from './utils/StyleContext';
import type { createStyles } from './createStyles';

export function useClassNames<T extends ReturnType<typeof createStyles>>(
  styleSheet: T,
  ...topLevelArgs: Parameters<T['topLevelStyleFunction']>
): AsClassNameObject<T, string> {
  const styleContext = useStyleContext();
  const name = styleContext.getUniqueClassName(
    styleSheet.symbol,
    styleSheet.name
  );
  useLayoutEffect(() => {
    styleContext.didRender();
  });

  return useMemo<AsClassNameObject<T, string>>(() => {
    const styleObject = styleSheet.topLevelStyleFunction(
      ...topLevelArgs
    ) as any;

    Object.entries(styleObject).forEach(
      ([key, localStyles]: [string, Function]) => {
        const displayName = `${name}_${key}`;

        styleObject[key] = (...localArgs: any[]) => {
          let [globalIndex, , record] = cacheRead(
            styleSheet.cache,
            key,
            topLevelArgs,
            localArgs
          );

          if (record) return record as T;

          const styleObject =
            typeof localStyles === 'function'
              ? localStyles(...localArgs)
              : localStyles;

          // Delete any conditions that were not met
          delete styleObject[BLOCK_KEY];

          const styleArray = convertStylesToArray(styleObject);

          // Call implementations to do their stuff (css right now..)..
          const className = `sw-${displayName}-${styleSheet.uniqueCounter++}`;
          const rawCss = parseCss(styleArray, className);
          styleContext.appendCss(rawCss);

          record = className;

          cacheWrite(
            styleSheet.cache,
            key,
            globalIndex,
            topLevelArgs,
            localArgs,
            record
          );

          return record as T;
        };
      }
    );
    return styleObject;
  }, topLevelArgs);
}

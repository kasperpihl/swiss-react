import { PropertiesFallback } from 'csstype';
import { ALLOW_KEY } from '../condition';
import {
  StyleObjectArray,
  StyleObjectNode,
  StyleObjectSelector
} from '../types';

export function convertStylesToArray(
  styleObject: PropertiesFallback
): StyleObjectArray {
  let rootArray: StyleObjectArray = [];

  function loop(
    sO: PropertiesFallback,
    targetArray: StyleObjectArray,
    lastKnownSelector = '&'
  ) {
    Object.entries(sO).forEach(([property, value]) => {
      if (typeof value === 'function') {
        throw Error('Function not allowed when parsing styles');
      }
      if (typeof value === 'object') {
        if (Array.isArray(value)) {
          targetArray.push(
            ...(value.map((v) => ({
              type: 'node',
              property,
              value: v
            })) as StyleObjectNode[])
          );

          return;
        }
        if (property.startsWith(ALLOW_KEY)) {
          // Use same target array as before
          loop(value, targetArray);
          return;
        }

        let isMedia = property.startsWith('@media');

        // Assume some sort of selector.
        const newTargetArray: StyleObjectArray = [];
        const selector: StyleObjectSelector = {
          type: 'selector',
          property: isMedia ? lastKnownSelector : property,
          mediaQuery: isMedia ? property : undefined,
          value: newTargetArray
        };

        if (isMedia) {
          rootArray.push(selector);
        } else {
          targetArray.push(selector);
        }

        loop(value, newTargetArray, selector.property);
        return;
      } else {
        targetArray.push({
          type: 'node',
          property,
          value
        });
      }
    });
  }
  loop(styleObject, rootArray);

  return rootArray;
}

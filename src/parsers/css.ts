import { StyleObjectArray, StyleObjectSelector } from '../types';
const indent = (depth: number) => new Array(depth + 1).map(() => '').join('  ');
const uncamel = (property: string) =>
  property.replace(/([A-Z])/g, (g) => '-' + g[0].toLowerCase());

const setClassname = (property: string, className: string) =>
  className
    .split(/,\ ?/g)
    .map((s) => property.replace(/&/gi, s))
    .join(', ');

export function parseCss(styleArray: StyleObjectArray, className: string) {
  let selectors: string[][] = [[]];

  function loop(
    selectorObj: StyleObjectSelector,
    selectorIndex: number,
    mediaQuery?: string
  ) {
    if (!selectors[selectorIndex]) {
      selectors[selectorIndex] = [];
    }

    let didAddMediaQuery = false;
    const depth = mediaQuery ? 1 : 0;

    if (mediaQuery && !selectors[selectorIndex].length) {
      didAddMediaQuery = true;
      selectors[selectorIndex].push(`${selectorObj.mediaQuery} {`);
    }

    let didAddSelector = false;
    function lazyOpen() {
      if (!didAddSelector) {
        selectors[selectorIndex].push(
          `${indent(depth)}${setClassname(
            selectorObj.property,
            `.${className}`
          )} {`
        );
        didAddSelector = true;
      }
    }
    function lazyClose() {
      if (didAddSelector) {
        didAddSelector = false;
        selectors[selectorIndex].push(`${indent(depth)}}`);
      }
    }

    selectorObj.value.forEach((node) => {
      if (node.type === 'node') {
        lazyOpen();
        selectors[selectorIndex].push(
          `${indent(depth + 1)}${uncamel(node.property)}: ${node.value};`
        );
      }
      if (node.type === 'selector') {
        if (node.mediaQuery || !mediaQuery) {
          loop(node, selectors.length, node.mediaQuery);
        } else {
          lazyClose();
          loop(node, selectorIndex, mediaQuery);
        }
      }
    });

    lazyClose();
    if (didAddMediaQuery) {
      selectors[selectorIndex].push(`}`);
    }
  }

  const initialSelector: StyleObjectSelector = {
    type: 'selector',
    property: '&',
    value: styleArray
  };

  loop(initialSelector, 0);

  return selectors.map((s) => s.join('\r\n')).join('\r\n');
}

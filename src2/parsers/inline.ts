import { StyleObjectArray } from 'src/types';

export function parseInline(styleArray: StyleObjectArray) {
  const inlineStyles: any = {};
  styleArray.forEach(s => {
    if (s.type === 'selector') {
      throw Error('selectors are not support for inline');
    }
    if (s.type === 'node') {
      inlineStyles[s.property] = s.value;
    }
  });

  return inlineStyles;
}

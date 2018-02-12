import { parseMixins } from '../features/mixins';

import parseKeyValue from '../helpers/parseKeyValue';
import testCondition from '../helpers/testCondition';

export default (styleArray, props) => {
  const composedStyles = {};
  styleArray.forEach((styleObj) => {
    const conditions = styleObj.conditions || [];
    const passed = conditions.filter((c) => testCondition(c, props));

    if(passed.length === conditions.length) {
      const dStyles = parseMixins(styleObj.styles, props);
      Object.entries(dStyles).forEach(([selector, styleValue]) => {
        const { key, value } = parseKeyValue(selector, styleValue, props);
        delete dStyles[selector];
        dStyles[key] = value;
      });
      Object.assign(composedStyles, dStyles);
    }
  })
  return composedStyles;
}
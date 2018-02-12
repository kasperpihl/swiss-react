import { parseVariables } from '../features/variables';
import { parseMixins } from '../features/mixins';
import { runPlugin } from '../features/plugins';

import parseKeyValue from '../helpers/parseKeyValue';
import testCondition from '../helpers/testCondition';

export default class Inliner {
  constructor(styleArray, allProps) {
    this.styleArray = styleArray;
    this.allProps = allProps;
  }

  generateInlineObject(styleArray, depth) {
    const composedStyles = {};
    styleArray.forEach((styleObj) => {
      const conditions = styleObj.conditions || [];
      const passed = conditions.filter((c) => testCondition(c, this.props));

      if(passed.length === conditions.length) {
        const dStyles = parseMixins(styleObj.styles, this.props);
        Object.entries(dStyles).forEach(([selector, styleValue]) => {
          const { key, value } = parseKeyValue(selector, styleValue, this.props);
          delete dStyles[selector];
          dStyles[key] = value;
        });
        Object.assign(composedStyles, dStyles);
      }
    })
    console.log(composedStyles);
    return composedStyles;
  }

  run(props) {
    this.props = props;
    return this.generateInlineObject(this.styleArray);
    // return this.getPrintedCSS(this.styleArray, 0);
  }
}
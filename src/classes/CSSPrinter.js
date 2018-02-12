import { parseMixins } from '../features/mixins';
import { runPlugin } from '../features/plugins';

import parseProps from '../helpers/parseProps';
import parseKeyValue from '../helpers/parseKeyValue';
import testCondition from '../helpers/testCondition';

import indentString from '../utils/indentString';

export default class CSSPrinter {
  constructor(styleArray, allProps) {
    this.styleArray = styleArray;
    this.allProps = allProps;
    this.swissObjects = {};
  }

  printCSSKeyValues(styles, depth, props) {
    let string = '';
    styles = parseMixins(styles, props);
    Object.entries(styles).forEach(([selector, styleValue]) => {

      let { key, value } = parseKeyValue(selector, styleValue, props);
      // Support prefix with [] keys/values;
      if(!Array.isArray(value)) {
        value = [ value ];
      }
      if(!Array.isArray(key)) {
        key = [ key ];
      }
      key.forEach((pK) => {
        // Here we add support for camel case.
        pK = pK.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
        value.forEach((pV) => {
          string += `${indentString(depth)}${pK}: ${pV};\r\n`;
        });
      });
      
    });
    return string;
  }
  getRawCss(styleObj, depth, props, extraSelector) {
    let { selector, selectors, styles } = styleObj;
    if(extraSelector && selectors) {
      selectors = selectors.concat(extraSelector);
    }
    if(selector.indexOf('&') > -1 && selectors) {
      selector = selector.replace(/&/gi, selectors.join(''));
    }

    selector = parseProps(selector, props);
    let rawCss = `${indentString(depth)}${selector} {\r\n`;
    rawCss += this.printCSSKeyValues(styles, depth + 1, props);
    rawCss += `${indentString(depth)}}`
    rawCss = runPlugin(
      'parseRawCss', 
      rawCss,
    );
    return rawCss;
  }
  printStyleArray(styleArray, depth) {
    styleArray.forEach((styleObj) => {
      if(Array.isArray(styleObj.styles)) {
        return this.printStyleArray(styleObj.styles, depth + 1);
      }

      styleObj.rawCss = '';
      if(styleObj.pureCss){
        styleObj.rawCss = styleObj.pureCss;
        return;
      }
      
      const conditions = styleObj.conditions || [];
      const passed = conditions.filter((c) => testCondition(c, this.props));

      if(passed.length !== conditions.length) {
        return delete styleObj.rawCss;
      }
      styleObj.rawCss = this.getRawCss(styleObj, depth, this.props);

    })
  }

  getPrintedCSS(styleArray, depth) {
    return styleArray.map(({ selector, styles, rawCss }) => {
      let string = '';
      if(Array.isArray(styles)) {
        string += `${indentString(depth)}${selector} {\r\n`;
        string += this.getPrintedCSS(styles, depth + 1);
        string += `${indentString(depth)}\r\n}`;
      } else if(rawCss) {
        string += rawCss + '\r\n';
      }
      return string;
    }).filter(s => !!s).join('');
  }
  print(props) {
    this.props = props;
    this.printStyleArray(this.styleArray, 0);
    return this.getPrintedCSS(this.styleArray, 0);
  }
}
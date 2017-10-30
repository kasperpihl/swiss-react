import { parseVariables } from './variables';
import { parseMixins } from './mixins';
import { runPlugin } from './plugins';
import indentString from './indentString';

const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

export default class CSSPrinter {
  constructor(styleArray, allProps) {
    this.styleArray = styleArray;
    this.allProps = allProps;
    this.swissObjects = {};
  }
  parseProps(props, value) {
    props = props || {};
    return value.replace(PROPS_REGEX, (v1, propName, defaultValue) => {
      return props[propName] || defaultValue || '';
    })
  }

  parseKeyValue(styleKey, styleValue, props) {
    // Here we add support for camel case.
    styleKey = styleKey.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());

    if(styleKey === 'content') {
      styleValue = `'${styleValue}'`;
    }
    
    // Parse props
    styleValue = this.parseProps(props, '' + styleValue);

    // Parse variables
    styleValue = parseVariables('' + styleValue);

    styleKey = runPlugin('parseKey', styleKey);

    runPlugin('parseValue', styleValue);
    runPlugin('parseKeyValue', (handler) => {
      const { key, value } = handler({ key: styleKey, value: styleValue });
      styleKey = key;
      styleValue = value;
    })

    return {
      key: styleKey,
      value: styleValue,
    };
  }

  iterateSwissObjects(propsEntries) {
    propsEntries.forEach(([swissId, cProps]) => {
      if(cProps.swiss) {
        this.swissObjects[swissId] = this.getRawCss(`#${swissId}`, cProps.swiss, 0, cProps);
      } else if(!cProps.swiss && this.swissObjects[swissId]) {
        delete this.swissObjects[swissId];
      }
    })
  }

  printCSSKeyValues(styles, depth, props) {
    let string = '';
    styles = parseMixins(styles);
    Object.entries(styles).forEach(([selector, styleValue]) => {

      let { key, value } = this.parseKeyValue(selector, styleValue, props);
      // Support prefix with [] keys/values;
      if(!Array.isArray(value)) {
        value = [ value ];
      }
      if(!Array.isArray(key)) {
        key = [ key ];
      }
      key.forEach((pK) => {
        value.forEach((pV) => {
          string += `${indentString(depth)}${pK}: ${pV};\r\n`;
        });
      });
      
    });
    return string;
  }
  getRawCss(styleObj, depth, props, extraSelector) {
    let { selector, selectors, styles } = styleObj;
    if(extraSelector) {
      selectors = selectors.concat(extraSelector);
    }
    if(selector.indexOf('&') > -1 && selectors) {
      selector = selector.replace(/&/gi, selectors.join(''));
    }
    console.log(selector);
    selector = this.parseProps(props, selector);
    let rawCss = `${indentString(depth)}${selector} {\r\n`;
    rawCss += runPlugin(
      'parseRawCss', 
      this.printCSSKeyValues(styles, depth + 1, props),
    );
    rawCss += `${indentString(depth)}}`;
    return rawCss;
  }
  printStyleArray(styleArray, depth) {
    styleArray.forEach((styleObj) => {
      if(Array.isArray(styleObj.styles)) {
        return this.printStyleArray(styleObj.styles, depth + 1);
      }
      styleObj.rawCss = styleObj.rawCss || { byId: {} };
      const conditions = Object.entries(styleObj.conditions || {});

      // Handle dynamic components
      if(this.allProps.length || conditions.length) {
        this.propsEntries.forEach(([swissId, cProps]) => {
          const metConditions = !conditions.filter(([key, value]) => cProps[key] !== value).length;
          if(!metConditions) {
            console.log('no meet', swissId);
            return delete styleObj.rawCss.byId[swissId];
          }
          styleObj.rawCss.byId[swissId] = this.getRawCss(styleObj, depth, cProps, `.${swissId}`);
        });
      } else { // Handle static styles
        styleObj.rawCss.byId['global'] = this.getRawCss(styleObj, depth);
      }
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
        string += Object.values(rawCss.byId).join('\r\n');
      }
      return string;
    }).join('\r\n');
  }
  print(props, changes) {
    this.propsEntries = Object.entries(props || {});
    this.changes = changes;
    this.printStyleArray(this.styleArray, 0);
    this.iterateSwissObjects(this.propsEntries);
    console.log(this.styleArray);
    return this.getPrintedCSS(this.styleArray, 0);
  }
}
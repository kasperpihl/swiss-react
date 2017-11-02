import { parseVariables } from './utils/variables';
import { parseMixins } from './utils/mixins';
import { runPlugin } from './utils/plugins';
import indentString from './utils/indentString';

const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

export default class CSSPrinter {
  constructor(styleArray, allProps, swissController) {
    this.styleArray = styleArray;
    this.swissController = swissController;
    this.allProps = allProps;
    this.swissObjects = {};
  }
  parseProps(props, value) {
    props = props || {};
    return value.replace(PROPS_REGEX, (v1, propName, defaultValue) => {
      const pVal = props[propName]
      if(typeof pVal === 'string' && pVal.startsWith('__swiss-')) {
        const uniqueId = pVal.slice(8);
        const styleHandler = this.swissController.getStyleHandler(uniqueId);
        return `.${styleHandler.getClassName()}`;
      }
      return pVal || defaultValue || '';
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
        let rawCss = '';
        cProps.swiss.forEach((styleObj) => {
          rawCss += this.getRawCss(styleObj, 0, cProps) + '\r\n';
        })
        this.swissObjects[swissId] = rawCss;
        
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
    if(extraSelector && selectors) {
      selectors = selectors.concat(extraSelector);
    }
    if(selector.indexOf('&') > -1 && selectors) {
      selector = selector.replace(/&/gi, selectors.join(''));
    }

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
          const metConditions = !conditions.filter(([key, value]) => {
            if(value === true) {
              return !cProps[key];
            } else {
              return ( cProps[key] !== value );
            }
          }).length;
          if(!metConditions) {
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
    const swissObjects = Object.values(this.swissObjects);
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
    }).concat(swissObjects).join('\r\n');
  }
  print(props, changes) {
    this.propsEntries = Object.entries(props || {});
    this.changes = changes;
    this.printStyleArray(this.styleArray, 0);
    this.iterateSwissObjects(this.propsEntries);
    return this.getPrintedCSS(this.styleArray, 0);
  }
}
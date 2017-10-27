import { parseVariables } from './utils/variables';
import { parseMixins } from './utils/mixins';
import { runPlugin } from './utils/plugins';

const VARREGEX = /#{(.*?)}/gi;

export default class CSSPrinter {
  constructor(styleArray) {
    this.styleArray = styleArray;
    this.swissObjects = {};
  }
  parseProps(props, value) {
    if(!props){ 
      return value;
    }
    return value.replace(VARREGEX, (v1, propName) => props[propName] || '');
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

    
    runPlugin('parseKey', (handler) => {
      styleKey = handler(styleKey);
    });
    runPlugin('parseValue', (handler) => {
      styleValue = handler(styleValue);
    });
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

  recursiveParseStyleObject(styleProperty, styleObject, depth, props, rootStyleKey) {
    let rootPrefix = depth ? '' : `${styleProperty || ''}`;
    if(rootPrefix) {
      rootPrefix = rootPrefix.replace(/&/gi, `${rootStyleKey}`);
      rootPrefix = this.parseProps(props, rootPrefix);
    }
    
    let styleString = `${rootPrefix} {\r\n`;
    // console.log(styleProperty, )
    styleObject = parseMixins(styleObject);

    Object.entries(styleObject).forEach(([styleKey, styleValue]) => {
      let parsedKey = styleKey;
      let parsedValue;
      let separator = '';
      let ending = '\r\n';
      if(typeof styleValue === 'object') {
        parsedKey = parsedKey.replace(/&/gi, `${rootStyleKey}`);
        parsedKey = this.parseProps(props, parsedKey);
 
        parsedValue = this.recursiveParseStyleObject(styleKey, styleValue, depth + 1, props, rootStyleKey);

      } else {
        const parsedObj = this.parseKeyValue(styleKey, styleValue, props);
        parsedKey = parsedObj.key;
        parsedValue = parsedObj.value;
        separator = ': ';
        ending = ';\r\n';
      }

      // Support prefix with [] keys/values;
      if(!Array.isArray(parsedValue)) {
        parsedValue = [ parsedValue ];
      }
      if(!Array.isArray(parsedKey)) {
        parsedKey = [ parsedKey ];
      }

      parsedKey.forEach((pK) => {
        parsedValue.forEach((pV) => {
          // Properly handle indention.
          for(let i = 0 ; i <= depth ; i++) styleString += '  ';
          styleString += pK + separator + pV + ending;
        });
      });
    })

    for(let i = 0 ; i < depth ; i++) styleString += '  ';

    styleString += '}\r\n';

    return styleString;
  }
  iterateStyleArray(dynamic, propsEntries, changes) {
    

    this.styleArray.forEach((styleObj) => {
      if(!styleObj.rawCss) {
        styleObj.rawCss = styleObj.rawCss || { byId: {} };

        const { rootStyleKey, styleKey, styleValue, valueProps = {} } = styleObj;
        const valueKeys = Object.keys(valueProps);

        if(dynamic) {
          propsEntries.forEach(([swissId, cProps]) => {
            const hasMatchingProps = !!valueKeys.filter(vK => typeof cProps[vK] !== 'undefined').length;
            if(!valueKeys.length || hasMatchingProps){
              let rawCss = this.recursiveParseStyleObject(styleKey, styleValue, 0, cProps, `.${swissId}${rootStyleKey}`);
              runPlugin('parseRawCss', (handler) => {
                rawCss = handler(rawCss);
              });
              styleObj.rawCss.byId[swissId] = rawCss;
            }
          });
        } else {
          let rawCss = this.recursiveParseStyleObject(styleKey, styleValue, 0, null, rootStyleKey);
          runPlugin('parseRawCss', (handler) => {
            rawCss = handler(rawCss);
          });
          styleObj.rawCss.byId.global = rawCss;
        }
      }
    });
  }
  iterateSwissObjects(propsEntries) {
    propsEntries.forEach(([swissId, cProps]) => {
      if(cProps.swiss) {
        let rawCss = this.recursiveParseStyleObject(`#${swissId}`, cProps.swiss, 0, cProps, `#${swissId}`);
        runPlugin('parseRawCss', (handler) => {
          rawCss = handler(rawCss);
        });
        this.swissObjects[swissId] = rawCss;
        console.log(rawCss);
      } else if(!cProps.swiss && this.swissObjects[swissId]) {
        delete this.swissObjects[swissId];
      }
    })
  }
  print(dynamic, props, changes) {
    const propsEntries = Object.entries(props || {});

    this.iterateStyleArray(dynamic, propsEntries, changes);
    this.iterateSwissObjects(propsEntries);

    return this.styleArray.map(s => {
      let string = '';
      string += Object.values(s.rawCss.byId).join('\n\r');
      return string;
    }).concat(Object.values(this.swissObjects)).join('\n\r');
  }
}
import { parseVariables } from './variables';
import { parseMixins } from './mixins';
import { runPlugin } from './plugins';

// ======================================================
// Printing out the stylesheet
// ======================================================
const parseKeyValue = (styleKey, styleValue) => {
  // Here we add support for camel case.
  styleKey = styleKey.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());

  if(styleKey === 'content') {
    styleValue = `'${styleValue}'`;
  }

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

const recursiveParseStyleObject = (styleObject, depth) => {
  let styleString = '{\r\n';
  styleObject = parseMixins(styleObject);
  Object.entries(styleObject).forEach(([styleKey, styleValue]) => {
    let parsedKey = styleKey;
    let parsedValue;
    let separator = '';
    let ending = '\r\n';
    if(typeof styleValue === 'object') {
      parsedValue = recursiveParseStyleObject(styleValue, depth + 1);
    } else {
      const parsedObj = parseKeyValue(styleKey, styleValue);
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
    })    
  })

  for(let i = 0 ; i < depth ; i++) styleString += '  ';

  styleString += '}\r\n';

  return styleString;
}


export default function printer(styleArray) {
  let styleString = '';
  styleArray.forEach(({styleKey, styleValue}) => {
    styleString += `${styleKey} ${recursiveParseStyleObject(styleValue, 0)}`;
  })
  runPlugin('parseRawCss', (handler) => {
    styleString = handler(styleString);
  });
  return styleString;
}  
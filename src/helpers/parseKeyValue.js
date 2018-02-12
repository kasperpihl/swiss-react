import { parseVariables } from '../features/variables';
import { parseMixins } from '../features/mixins';
import { runPlugin } from '../features/plugins';

const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

export default (styleKey, styleValue, props = {}) => {
  if(styleKey === 'content') {
    styleValue = `'${styleValue}'`;
  }
  
  // Parse props
  styleValue = ('' + styleValue).replace(PROPS_REGEX, (v1, propName, defaultValue) => {
    const pVal = props[propName]
    return pVal || defaultValue || '';
  })

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
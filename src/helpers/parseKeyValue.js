import { parseVariables } from '../features/variables';
import { runPlugin } from '../features/plugins';
import parseProps from './parseProps';

export default (styleKey, styleValue, props = {}) => {
  if(styleKey === 'content') {
    styleValue = `'${styleValue}'`;
  }
  
  // Parse props
  styleValue = parseProps('' + styleValue, props);

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
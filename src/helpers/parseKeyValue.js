import { parseVariables } from '../features/variables';
import { runPlugin } from '../features/plugins';
import parseProps from './parseProps';

export default (styleKey, styleValue, props = {}, touchedProps) => {
  if(styleKey === 'content') {
    styleValue = `'${styleValue}'`;
  }
  
  // Parse props
  styleValue = parseProps('' + styleValue, props, touchedProps);

  // Parse variables
  styleValue = parseVariables('' + styleValue);

  // styleKey = runPlugin('parseKey', styleKey);

  // runPlugin('parseValue', styleValue);
  runPlugin('parseKeyValue', (handler) => {
    const res = handler(styleKey, styleValue);
    if(typeof res !== 'object' || typeof res.key !== 'string') {
      return console.warn('swiss plugin error for: parseKeyValue. Expected object with key and value.');
    }
    styleKey = res.key;
    styleValue = res.value;
  })

  return {
    key: styleKey,
    value: styleValue,
  };
}
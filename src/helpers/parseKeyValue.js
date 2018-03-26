import { parseVariables } from '../features/variables';
import { runPlugin } from '../features/plugins';
import parseProps from './parseProps';

export default (key, value, props = {}, touchedProps) => {
  if(key === 'content') {
    value = `'${value}'`;
  }
  
  // Parse props
  value = parseProps(value, props, touchedProps);

  // Parse variables
  value = parseVariables(value);

  runPlugin('parseKeyValue', (handler) => {
    const res = handler(key, value);
    if(typeof res !== 'object' || typeof res.key !== 'string') {
      return console.warn('swiss plugin error for: parseKeyValue. Expected object with key and value.');
    }
    key = res.key;
    value = res.value;
  })

  return {
    key,
    value,
  };
}
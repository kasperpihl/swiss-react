import { addPlugin } from './plugins';

if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
  // I'm in react-native
  // Parse '9' to 9. React native uses numbers and not strings for styles.
  addPlugin('parseKeyValue', (k, v) => {
    const intRegex = /^([+-]?[1-9]\d*|0)$/;
    const floatRegex = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/;
    if(intRegex.test(v)) {
      return [k, parseInt(v, 10)];
    } else if(floatRegex.test(v)) {
      return [k, parseFloat(v)];
    }
  });
} else {
  // I'm on the web or node js!
  // CSS:after content fix. Turns 'value' into ''value'';
  addPlugin('parseKeyValue', (k, v) => k === 'content' && v === '' && [k, `'${v}'`]);
}
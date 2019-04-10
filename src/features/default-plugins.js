import { addPlugin } from './plugins';

// I'm on the web or node js!
// CSS:after content fix. Turns 'value' into ''value'';
addPlugin(
  'parseKeyValue',
  (k, v) => k === 'content' && v === '' && [k, `'${v}'`]
);

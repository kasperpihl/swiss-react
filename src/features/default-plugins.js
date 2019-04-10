import { addPlugin } from './plugins';

// CSS:after content fix. Turns 'value' into ''value'';
addPlugin(
  'parseKeyValue',
  (k, v) => k === 'content' && v === '' && [k, `'${v}'`]
);

import { addPlugin } from './plugins';

if (navigator.product != 'ReactNative') {
  // CSS:after content fix. Turns 'value' into ''value'';
  addPlugin(
    'parseKeyValue',
    (k, v) => k === 'content' && v === '' && [k, `'${v}'`]
  );
}

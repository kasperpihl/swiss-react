import { addPlugin } from './plugins';

// I'm on web or nodejs
if (typeof document != 'undefined' || typeof navigator == 'undefined') {
  // CSS:after content fix. Turns 'value' into ''value'';
  addPlugin(
    'parseKeyValue',
    (k, v) => k === 'content' && v === '' && [k, `'${v}'`]
  );
}

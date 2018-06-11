import { setOption } from './options';

if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
  // I'm in react-native
  setOption('inline', true);
} else {
  // I'm on the web or node js!
  setOption('defaultEl', 'div');
}
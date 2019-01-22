import makeSwissComponent from './makeSwissElement';
import SwissProvideContext from '../components/SwissProvideContext';

const nullFunc = () => null;
const styleSheets = {};

export default (name, styles) => {
  if (typeof name !== 'string') {
    return console.warn(
      'swiss styleSheet: first argument(name) must be a string'
    );
  }
  if (styleSheets[name]) {
    console.warn(
      `swiss styleSheet: a stylesheet already exists with the name "${name}"`
    );
  }
  styleSheets[name] = true;
  if (typeof styles !== 'object') {
    return console.warn(
      'swiss styleSheet: first or second argument must be an object with styles'
    );
  }

  let StyleSheet = {};
  for (let key in styles) {
    if (typeof styles[key] === 'object') {
      StyleSheet[key] = makeSwissComponent({
        type: `${name}_${key}`,
        styles: styles[key]
      });
    }
  }
  StyleSheet.ProvideContext = SwissProvideContext;

  if (typeof Proxy !== 'undefined') {
    StyleSheet = new Proxy(StyleSheet, {
      get: (obj, prop) => {
        if (prop === '__esModule' || prop === 'default' || prop === '$$typeof')
          return obj;
        if (obj[prop]) return obj[prop];
        console.warn(`swiss error: "${prop}" not found in "${name}"`);
        return nullFunc;
      }
    });
  }

  return StyleSheet;
};

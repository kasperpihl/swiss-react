import React, { forwardRef } from 'react';
import SwissElement from '../components/SwissElement';
import SwissProvideContext from '../components/SwissProvideContext';
import convertStylesToArray from './convertStylesToArray';

const nullFunc = () => null;

export default (name, styles) => {
  if (typeof name !== 'string') {
    return console.warn(
      'swiss styleSheet: first argument(name) must be a string'
    );
  }
  if (typeof styles !== 'object') {
    return console.warn(
      'swiss styleSheet: first or second argument must be an object with styles'
    );
  }

  let StyleSheet = {};
  for (let key in styles) {
    if (typeof styles[key] === 'object') {
      const options = {
        type: `${name}_${key}`,
        originalStyles: styles[key]
      };
      options.styles = [
        {
          selectors: ['&'],
          type: 'nested',
          condition: null,
          key: '&',
          value: convertStylesToArray(styles[key], ['&'], {}, (k, v) => {
            options[k] = v;
          })
        }
      ];
      const render = forwardRef((props, ref) => (
        <SwissElement innerRef={ref} {...props} __swissOptions={options} />
      ));
      render.displayName = `${name}_${key}`;
      StyleSheet[key] = render;
    }
  }
  StyleSheet.ProvideContext = SwissProvideContext;

  if (typeof Proxy !== 'undefined') {
    StyleSheet = new Proxy(StyleSheet, {
      get: (obj, prop) => {
        if (prop === '__esModule' || prop === 'default') return obj;
        if (obj[prop]) return obj[prop];
        let warning = `swiss error: component not found: "${prop}"`;
        if (name) {
          warning += ` in ${name}`;
        }
        console.warn(warning);
        return nullFunc;
      }
    });
  }

  return StyleSheet;
};

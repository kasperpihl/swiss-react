import React, { forwardRef } from 'react';
import SwissElement from '../components/SwissElement';
import SwissProvideContext from '../components/SwissProvideContext';
import convertStylesToArray from './convertStylesToArray';

const nullFunc = () => null;
const styleSheets = {};

export default (name, styles) => {
  if (typeof name !== 'string') {
    return console.warn(
      'swiss styleSheet: first argument(name) must be a string'
    );
  }
  if (styleSheets[name]) {
    return console.warn(
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
      const render = forwardRef((props, ref) => {
        const refProps = ref ? { innerRef: ref } : null;
        return (
          <SwissElement {...refProps} {...props} __swissOptions={options} />
        );
      });
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
        console.warn(`swiss error: "${prop}" not found in "${name}"`);
        return nullFunc;
      }
    });
  }

  return StyleSheet;
};

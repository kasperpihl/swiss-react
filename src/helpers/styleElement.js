import React from 'react';

import { defaultSwissController } from '../classes/SwissController';
import SwissContext from '../components/SwissContext';
import { getOption } from '../features/options';
import convertStylesToArray from './convertStylesToArray';

const styleElement = (options, ...styles) => {
  if(options && options.__isSwissElement) {
    styles = options.getStyles().concat(styles);
    options = Object.assign({}, options.getOptions());
  }

  if(typeof options !== 'object') {
    options = { element: options };
  }

  if(!options.element) {
    return console.warn('swiss styleElement(): options must include element');
  }

  if(typeof options.inline === 'undefined') {
    options.inline = !!getOption('inline');
  }
  if(typeof options.debug === 'undefined') {
    options.debug = !!getOption('debug');
  }

  // Support for adding swiss elements and grab their styles.
  let index = 0;
  let foundClassName = '';
  do {
    const styleSheet = styles[index];
    if(typeof styleSheet === 'function' && styleSheet.__isSwissElement) {
      const dStyles = styleSheet.getStyles();
      styles.splice(index, 1, ...dStyles);
      index += dStyles.length;
    } else if(typeof styleSheet === 'object') {
      if(styleSheet.__swissStyleClassName) {
        foundClassName += styleSheet.__swissStyleClassName;
      }
      index++;
    } else {
      styles.splice(index, 1);
    }
  } while(index < styles.length);

  if(foundClassName) {
    options.className = foundClassName;
  }

  options.originalStyles = styles; // save before converting
  options.styles = Object.entries(styles).map((entry) => ({
    selectors: ['&'],
    type: 'nested',
    condition: null,
    key: '&',
    value: convertStylesToArray(entry[1], ['&']),
  }));
  options.defaultSwissController = defaultSwissController;

  const render = props => {
    return (
      <SwissContext 
        {...props}
        __swissOptions={options}
      />
    )
  };
  render.__isSwissElement = true;
  render.getOptions = () => options;
  render.getStyles = () => styles;
  render.pure = (...keys) => {
    options.pure = keys;
    return render;
  }
  render.debug = () => {
    options.debug = true;
    return render;
  }

  return render;
}

export default styleElement;
import React from 'react';

import { defaultSwissController } from '../classes/SwissController';
import SwissContext from '../components/SwissContext';
import { getOption } from '../features/options';
import convertStylesToArray from './convertStylesToArray';

const element = (options, ...styles) => {
  const className = typeof styles[0] === 'string' ? styles[0] : null;

  if(options && options.__isSwiss) {
    styles = options.getStyles().concat(styles);
    options = options.getOptions();
  }

  if(typeof options !== 'object') {
    options = { element: options };
  }

  if(!options.element) {
    return console.warn('swiss element(): options must include element');
  }
  if(className) {
    options.className = className;
  }

  if(typeof options.inline === 'undefined') {
    options.inline = !!getOption('inline');
  }
  if(typeof options.debug === 'undefined') {
    options.debug = !!getOption('debug');
  }

  // Support for adding swiss elements and grab their styles.
  let index = 0;
  do {
    const s = styles[index];
    if(typeof s === 'function' && s.__isSwiss) {
      const dStyles = s.getStyles();
      styles.splice(index, 1, ...dStyles);
      index += dStyles.length;
    } else if(typeof s !== 'object') {
      styles.splice(index, 1);
    } else {
      index++;
    }
  } while(index < styles.length);

  if(options.debug) {
    options.originalStyles = styles;
  }
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
  render.__isSwiss = true;
  render.getOptions = () => options;
  render.getStyles = () => styles;

  return render;
}

export default element;
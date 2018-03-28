import React from 'react';

import { defaultSwissController } from '../classes/SwissController';
import SwissElement from '../components/SwissElement';
import { getOption } from '../features/options';
import convertStylesToArray from './convertStylesToArray';

const element = (options, ...styles) => {
  if(typeof options !== 'object') {
    options = { element: options };
  }
  if(!options.element) {
    return console.warn('swiss element(): options must include element');
  }
  if(typeof styles[0] === 'string') {
    options.className = styles[0];
  }

  if(typeof options.inline === 'undefined') {
    options.inline = !!getOption('inline');
  }
  if(typeof options.debug === 'undefined') {
    options.debug = !!getOption('debug');
  }

  styles = styles.filter((s) => typeof s === 'object');
  options.styles = Object.entries(styles).map((entry) => ({
    selectors: ['&'],
    type: 'nested',
    condition: null,
    key: '&',
    value: convertStylesToArray(entry[1], ['&']),
  }));
  options.defaultSwissController = defaultSwissController;

  const render = props => {
    const {
      __swissOptions,
      ...rest,
    } = props;
    if(__swissOptions) {
      console.warn('__swissOptions is a reserved prop name.')
    }
    return (
      <SwissElement 
        {...rest}
        __swissOptions={options}
      />
    )
  };

  return render;
}

export default element;
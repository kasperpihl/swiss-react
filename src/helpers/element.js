import React from 'react';

import { defaultSwissController } from '../classes/SwissController';
import SwissElement from '../components/SwissElement';
import { getOption } from '../features/options';

const element = (options, ...styles) => {
  if(typeof options !== 'object') {
    options = { element: options };
  }
  if(!options.element) {
    return console.warn('swiss element: options must include element');
  }
  if(typeof options.inline === 'undefined') {
    options.inline = !!getOption('inline');
  }
  options.styles = styles;
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
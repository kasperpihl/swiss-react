import React from 'react';

import SwissController from '../classes/SwissController';
import SwissElement from '../components/SwissElement';
import { getOption } from '../features/options';

const swissController = new SwissController();

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

  options.defaultSwissController = swissController;

  const render = (props) => {
    const { 
      sw,
      ...rest
    } = props;
    let injectStyles = styles;
    if(sw) {
      injectStyles = [].concat(sw).concat(styles);
    }

    return (
      <SwissElement 
        __swissOptions={options}
        sw={injectStyles}
        {...rest} 
      />
    )
  };

  return render;
}

export default element;

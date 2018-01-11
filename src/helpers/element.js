import React from 'react';

import SwissController from '../classes/SwissController';
import SwissElement from '../components/SwissElement';

const swissController = new SwissController();

const element = (options, ...styles) => {
  if(typeof options !== 'object') {
    options = { element: options};
  }
  if(!options.element) {
    console.warn('swiss element: options must include element');
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

  render.addStyles = (...newStyles) => {
    styles = [].concat(newStyles).concat(styles);
  }
  render.getStyles = () => {
    return [].concat(styles);
  }

  return render;
}

export default element;

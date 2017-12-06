import { isValidElement } from 'react';

import makeComponent from '../components/makeComponent';

import SwissController from '../classes/SwissController';

import mergeDeep from '../utils/mergeDeep';
import isSwissElement from '../helpers/isSwissElement';

const swissController = new SwissController();

const element = (...args) => {
  let options = {
    element: 'div'
  };
  let styles = {};

  args.forEach((prop, i) => {
    if(typeof prop === 'string') {
      if(i === 0) {
        options.element = prop;
      } else if(i === 1) {
        options.className = prop;
      }
    }
    let dStyles = prop;
    if(isSwissElement(prop)) {
      dStyles = swissController.getStylesByUniqueId(prop.swissUniqueString);
    } else if(isValidElement(prop)) {
      options.element = prop; 
    } else if(typeof prop !== 'object') {
      return;
    }
    
    styles = mergeDeep(styles, dStyles);
  })
  
  options.styles = styles;
  return makeComponent(options, swissController);
}

export default element;

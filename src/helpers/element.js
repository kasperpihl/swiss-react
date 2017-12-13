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
    
    if(i === 0 && !isSwissElement(prop) && typeof prop !== 'object') {
      options.element = prop;
    }

    if(typeof prop === 'object' || isSwissElement(prop)) {
      let dStyles = prop;
      if(isSwissElement(prop)) {
        dStyles = swissController.getStylesByUniqueId(prop.swissUniqueString);
      }
      styles = mergeDeep(styles, dStyles);
    }
    
  })
  
  options.styles = styles;
  return makeComponent(options, swissController);
}

export default element;

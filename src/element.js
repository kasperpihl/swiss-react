import componentWrapper from './component-wrapper';
import mergeDeep from './utils/mergeDeep';
import isSwissElement from './utils/isSwissElement';
import SwissController from './swiss-controller';

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
    if(typeof prop !== 'object') {
      return;
    }
    let dStyles = prop;
    if(isSwissElement(prop)) {
      dStyles = swissController.getStylesByUniqueId(prop.swissUniqueString);
    }
    styles = mergeDeep(styles, dStyles);
  })
  
  options.styles = styles;
  return componentWrapper(options, swissController);
}

export default element;

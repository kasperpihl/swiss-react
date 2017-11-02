import componentWrapper from './component-wrapper';
import mergeDeep from './utils/mergeDeep';
import isSwissElement from './utils/isSwissElement';
import SwissController from './swiss-controller';

const swissController = new SwissController();

const element = (...args) => {
  let EL = 'div';
  let styles = {};

  args.forEach((prop, i) => {
    let dStyles;
    if(i === 0 && typeof prop === 'string') {
      EL = prop;
    }
    else if(isSwissElement(prop)) {
      dStyles = swissController.getStylesByUniqueId(prop.swissUniqueString);
    } else if(typeof prop === 'object') {
      dStyles = prop;
    }

    if(dStyles) {
      styles = mergeDeep(styles, dStyles);
    }
  })
  
  return componentWrapper(EL, styles, swissController);
}

export default element;

import componentWrapper from './component-wrapper';
import mergeDeep from './utils/mergeDeep';
import isSwissElement from './utils/isSwissElement';
import getOptionObject from './utils/getOptionObject';
import SwissController from './swiss-controller';

const swissController = new SwissController();

const element = (...args) => {
  let options = getOptionObject(args[0]) || {
    element: 'div'
  };
  let styles = {};

  args.forEach((prop, i) => {
    if(typeof prop !== 'object' || (i === 0 && getOptionObject(prop))) {
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

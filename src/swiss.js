import componentWrapper from './component-wrapper';
import mergeDeep from './utils/mergeDeep';

let number = 0;
const components = [];

const element = (EL, styles) => {
  // Support only the parameter as the styles (use a div then)
  if(typeof EL === 'object') {
    styles = EL;
    EL = 'div';
  }
  
  // Make sure we got the right parameters
  if(!styles || typeof styles !== 'object') {
    return console.warn('swiss: element needs styles object as first or second parameter');
  }
  if(!EL || typeof EL !== 'string') {
    return console.warn('swiss: element needs first parameter to be the desired html tag as a string');
  }
  
  const component = componentWrapper(EL, styles, number++);
  components.push(component);

  component.extend = (newStyles) => {
    // Make sure we got the right parameters
    if(!newStyles || typeof newStyles !== 'object') {
      return console.warn('swiss: element extend needs styles object as first parameter');
    }

    const mergedStyles = mergeDeep(styles, newStyles);
    return element(EL, mergedStyles);
  }

  return component;
}

export default element;

export function serverReset() {
  components.forEach((component) => {
    component._swissServerReset();
  });
}

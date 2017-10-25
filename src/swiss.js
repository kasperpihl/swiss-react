import componentWrapper from './component-wrapper';

let number = 0;
const components = [];

const swiss = (EL, styles) => {
  // Support only the parameter as the styles (use a div then)
  if(typeof EL === 'object') {
    styles = EL;
    EL = 'div';
  }
  
  // Make sure we got the right parameters
  if(!styles || typeof styles !== 'object') {
    return console.warn('swiss needs styles object as first or second parameter');
  }
  if(!EL || typeof EL !== 'string') {
    return console.warn('swiss needs first parameter to be the desired html tag as a string');
  }
  
  // Assume styles are the default if default is not provided
  if(!styles.default) {
    styles = { default: styles };
  }
  const component = componentWrapper(EL, styles, number++);
  components.push(component);
  return component;

}

swiss.serverReset = () => {
  components.forEach((component) => {
    component._swissServerReset();
  });
};

export default swiss;



import Parser from '../classes/Parser';
import NewParser from '../classes/NewParser';
import mergeDeep from '../utils/mergeDeep';
export default (ref, props) => {
  const subscription = {
      ref,
      props,
      styles: {},
    };
    let sw = props.__swissOptions.styles;
    if(!sw) {
      return subscription;
    }
    
    if(typeof sw === 'string' || (typeof sw === 'object' && !Array.isArray(sw))) {
      sw = [ sw ];
    }
    if(!Array.isArray(sw)) {
      return console.warn('sw prop must be an array, string or object');
    }
    // const newParser = new NewParser(sw);

    sw.forEach((res) => {
      if(typeof res === 'object') {
        subscription.styles = mergeDeep(subscription.styles, res);
      }
    })

    const parser = new Parser();
    subscription.parsedStyles = parser.run(subscription.styles, `.sw-${ref}`);

    return subscription;
}



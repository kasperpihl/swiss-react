import Parser from '../classes/Parser';
import { getStyles } from '../features/styles';
import mergeDeep from '../utils/mergeDeep';

export default (ref, props) => {
  const subscription = {
      ref,
      props,
      styles: {},
    };
    let { sw } = props;
    if(!sw) {
      return subscription;
    }
    
    if(typeof sw === 'string' || (typeof sw === 'object' && !Array.isArray(sw))) {
      sw = [ sw ];
    }
    if(!Array.isArray(sw)) {
      return console.warn('sw prop must be an array, string or object');
    }
    sw.forEach((res) => {
      if(typeof res === 'string') {
        res = res.split(' ');
        res.forEach((name) => {
          const styles = getStyles(name);
          if(styles) {
            subscription.styles = mergeDeep(styles, subscription.styles);
          } else {
            console.warn(`swiss subscribe: styles not found for name "${name}"`)
          }
        })
      } else if(typeof res === 'object') {
        subscription.styles = mergeDeep(res, subscription.styles);
      }
    })

    const parser = new Parser();
    subscription.parsedStyles = parser.run(subscription.styles, `.sw-${ref}`);

    return subscription;
}
const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

export default (values, props, touchedProps) => {
  props = props || {};
  let wasArray = true;
  if(!Array.isArray(values)) {
    values = [ values ];
    wasArray = false;
  }

  const res = values.map((v) => {
    if(typeof v !== 'string') {
      return v;
    }
    return v.replace(PROPS_REGEX, (v1, propName, defaultValue) => {
      if(touchedProps) {
        touchedProps[propName] = true;
      }

      const pVal = props[propName]
      return pVal || defaultValue || '';
    })
  });

  return wasArray ? res : res[0];
}
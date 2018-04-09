const plugins = {
  parseKeyValue: [],
  parseRawCss: [],
  parseRawInline: [],
};

export function addPlugin(name, handler) {
  if(!plugins[name]){
    return console.warn(`swiss addPlugin: unknown plugin ${name}`);
  }
  if(typeof handler !== 'function') {
    return console.warn('swiss addPlugin: second argument should be the plugin handler');
  }

  plugins[name].push(handler);
}


export function parseRawCss(rawCss, props) {
  runPlugin('parseRawCss', (handler, i) => {
    const res = handler(rawCss, props);
    if(typeof res !== 'undefined' && res !== false) {
      if(typeof res !== 'string') {
        return console.warn(`swiss plugin parseRawCss[${i}] error: Expected string. Got ${typeof res}`);
      } 
      rawCss = res;
    }
  });
  return rawCss;
}

export function parseKeyValue(key, value, props) {
  runPlugin('parseKeyValue', (handler, i) => {
    const res = handler(key, value, props);
    if(typeof res !== 'undefined' && res !== false) {
      if(!Array.isArray(res)) {
        return console.warn(`swiss plugin parseKeyValue[${i}] error: Expected array. Got ${typeof res}`);
      }
      if(res.length !== 2 || typeof res[0] !== 'string') {
        return console.warn(`swiss plugin parseKeyValue[${i}] error: Expected array with [string, value]`);
      } 
      key = res[0];
      value = res[1];
    }
    
  });
  return [key, value];
}

export function parseRawInline(inlineStyles, props) {
  runPlugin('parseRawInline', (handler, i) => {
    const res = handler(inlineStyles, props);
    if(typeof res !== 'undefined') {
      if(typeof res !== 'object') {
        return console.warn(`swiss plugin parseRawInline[${i}] error: Expected object. Got ${typeof res}`);
      }
      inlineStyles = res;
    }
  });
  return inlineStyles;
}

function runPlugin(name, iterator) {
  plugins[name].forEach((handler, i) => {
    iterator(handler, i);
  });
}
const plugins = {};

const supportedPlugins = [
  'parseKey',
  'parseValue',
  'parseKeyValue',
  'parseRawCss'
];

export function addPlugin(name, handler) {
  if(typeof name !== 'string' || supportedPlugins.indexOf(name) === -1) {
    return console.warn(`swiss addPlugin: first argument should be one of: ${supportedPlugins.join(', ')}.`);
  }
  if(typeof handler !== 'function') {
    return console.warn('swiss addPlugin: second argument should be the plugin handler');
  }

  if(!plugins[name]){
    plugins[name] = [];
  }

  plugins[name].push(handler);
}

export function runPlugin(name, iterator) {
  if(supportedPlugins.indexOf(name) === -1) {
    console.warn(`swiss runPlugin: unknown plugin ${name}`)
  }
  if(!plugins[name]) {
    return iterator;
  }
  plugins[name].forEach((handler) => {
    if(typeof iterator === 'function') {
      iterator(handler);
    } else {
      console.log(handler);
      iterator = handler(iterator);
    }
  })

  return iterator;
}
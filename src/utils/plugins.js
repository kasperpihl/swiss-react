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
    return;
  }
  plugins[name].forEach((handler) => {
    iterator(handler);
  })
}
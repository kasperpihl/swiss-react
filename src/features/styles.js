
const styles = {};

export function addStyles(options, style) {
  if(typeof options === 'string') {
    options = { name: options };
  }
  if(typeof options !== 'object' || typeof options.name !== 'string') {
    return console.warn('swiss addstyles: first parameter must be an object or a string');
  }

  styles[options.name] = style;
}

export function getStyles(name) {
  return styles[name];
}
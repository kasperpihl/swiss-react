const VAL_REGEX = /#{val\=?(.*?)}/gi;
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


const parseStyles = (style, valueFromObj) => {
  const mutatedStyles = Object.assign({}, style);
  Object.entries(style).forEach(([ key, value ]) => {
    if(typeof value === 'string') {
      mutatedStyles[key] = value.replace(VAL_REGEX, (v1, defaultValue) => {
        return valueFromObj || defaultValue || '';
      });
    } else if(typeof value === 'object') {
      delete mutatedStyles[key];
      mutatedStyles[key] = parseStyles(value);
    }
  });
  return mutatedStyles;
}
export function getStyles(name, valueFromObj) {
  const style = styles[name] || {};

  if(!valueFromObj) {
    return style;
  }

  return parseStyles(style, valueFromObj);
}
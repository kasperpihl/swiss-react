const options = {};

if(
  (typeof window !== 'undefined' && window.__DEV__) || // react native
  (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production')) {
  options.enableWarnings = true;
}

export function setOption(key, value) {
  options[key] = value;
}

export function getOption(key) {
  return options[key];
}
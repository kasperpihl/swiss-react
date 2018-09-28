const options = {};

export function setOption(key, value) {
  options[key] = value;
}

export function getOption(key) {
  return options[key];
}

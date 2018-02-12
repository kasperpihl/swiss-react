const options = {};

export function setGlobalOption(key, value) {
  options[key] = value;
}
export function unsetGlobalOption(key) {
  delete options[key]; 
}
export function getGlobalOption(key) {
  return options[key];
}
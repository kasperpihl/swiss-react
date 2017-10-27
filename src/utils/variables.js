let variables = {};

const VAR_REGEX = /\$([a-zA-Z0-9_-]*)/g;

export function addVariables(...varObjects) {
  variables = Object.assign(variables, ...varObjects);
}

export function parseVariables(string) {
  return string.replace(VAR_REGEX, (v1, varName) => {
    const result = variables[varName];
    if(typeof result === 'undefined') {
      console.warn('swiss unknown variable: ' + varName);
    } else if(['bool', 'number', 'string'].indexOf(typeof result) === -1) {
      console.warn(`swiss invalid varible of type: ${typeof result}. Expected string, number of bool`);
    } else {
      return result;
    }
    return v1;
  });
}
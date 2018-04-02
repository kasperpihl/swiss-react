let variables = {};

const VAR_REGEX = /\$([a-zA-Z0-9_-]*)/g;

export function addVariables(...varObjects) {
  varObjects.forEach(vO => Object.keys(vO).forEach(k => {
    variables[k] = vO[k];
  }))
}

export function getVariable(key) {
  return variables[key];
}

export function parseVariables(string, touchedVariables) {
  if(typeof string !== 'string') return string;

  return string.replace(VAR_REGEX, (v1, varName) => {
    const result = variables[varName];
    touchedVariables[`$${varName}`] = result;
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
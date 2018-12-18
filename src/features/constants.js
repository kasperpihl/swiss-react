const constants = {};

const CONST_REGEX = /\$([a-zA-Z0-9_-]*)/g;

export function addConstants(...constObjects) {
  constObjects.forEach(vO => {
    for (let k in vO) {
      if (['bool', 'number', 'string'].indexOf(typeof vO[k]) === -1) {
        console.warn(
          `swiss invalid varible of type: ${typeof result}. Expected string, number of bool`
        );
      } else {
        constants[k] = vO[k];
      }
    }
  });
}

export function getConstant(key) {
  return constants[key];
}

export function parseConstants(string) {
  if (typeof string !== 'string') return string;

  return string.replace(CONST_REGEX, (v1, varName) => {
    const result = constants[varName];
    if (typeof result === 'undefined') {
      console.warn('swiss unknown variable: ' + varName);
    }
    return result;
  });
}

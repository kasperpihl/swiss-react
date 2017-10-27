const mixins = {};

export function addMixin(name, handler) {
  if(typeof name !== 'string') {
    return console.warn('swiss addMixin: first argument should be name of mixin');
  }
  if(typeof handler !== 'function') {
    return console.warn('swiss addMixin: second argument should be the mixin handler');
  }
  if(!name.startsWith('_')) {
    name = `_${name}`;
  }
  mixins[name] = handler;
}

export function runMixin(mixinName, mixinArgs) {
  let result = {};
  const mixin = mixins[mixinName];
  if(typeof mixin === 'function') {
    if(!Array.isArray(mixinArgs)) {
      mixinArgs = [mixinArgs];
    }
    result = mixin(...mixinArgs);
    if(typeof result !== 'object') {
      console.warn(`swiss: mixin "${mixinName.slice(1)}" returned ${typeof result}. Expected object`);
      result = {};
    }
  } else {
    console.warn(`swiss: unknown mixin: ${mixinName.slice(1)}`);
  }
  return result;
}

export function parseMixins(styleObject) {
  const mutatedObject = Object.assign({}, styleObject);
  Object.entries(styleObject).forEach(([styleKey, styleValue]) => {
    if(styleKey.startsWith('_')) {
      delete mutatedObject[styleKey];
      Object.assign(mutatedObject, runMixin(styleKey, styleValue));
    }
  })
  return mutatedObject;
}
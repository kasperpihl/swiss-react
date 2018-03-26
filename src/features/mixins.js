import parseProps from '../helpers/parseProps';
import { parseVariables } from './variables';
import convertStylesToArray from '../helpers/convertStylesToArray';

const mixins = {};

export function addMixin(name, mixin) {
  if(typeof name !== 'string') {
    return console.warn('swiss addMixin: first argument should be name of mixin');
  }
  if(['function', 'object'].indexOf(typeof mixin) === -1) {
    return console.warn('swiss addMixin: second argument should be a function or an object');
  }
  if(!name.startsWith('_')) {
    name = `_${name}`;
  }
  mixins[name] = mixin;
}

function getMixin(name) {
  if(!mixins[name] && name.startsWith('_')) {
    name = name.slice(1);
  }
  const foundMixin = mixins[name];
  if(!foundMixin) {
    console.warn(`swiss: unknown mixin: ${name}`);
  }
  return foundMixin;
}

export function runMixin({ key, value, selectors }, props, touchedProps) {
  const mixin = getMixin(key);
  let result = mixin || null;
  if(typeof mixin === 'function') {
    if(!Array.isArray(value)) {
      value = [ value ];
    }
    // Make sure keys for mixins get parsed.
    value = parseProps(value, props, touchedProps);
    value = value.map(v => parseVariables(v));

    // Create a function for getting props
    const getProp = (name) => {
      touchedProps[name] = true;
      return props[name];
    }
    result = mixin(getProp, ...value);
    if(typeof result !== 'object') {
      console.warn(`swiss: mixin "${name.slice(1)}" returned ${typeof result}. Expected object`);
      result = {};
    }
  }
  if(result) {
    result = convertStylesToArray(result, selectors)
  }
  return result;
}
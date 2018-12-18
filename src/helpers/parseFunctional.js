export default (value, getProp) => {
  if (typeof value !== 'function') {
    return value;
  }
  let res = value(getProp);
  if (
    [false, null].indexOf(res) === -1 &&
    ['number', 'string', 'undefined'].indexOf(typeof res) === -1
  ) {
    res = undefined;
    console.warn('swiss parseFunction must return string or number');
  }
  return res;
};

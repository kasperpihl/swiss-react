export default (value, props) => {
  if(typeof value !== 'function') {
    return value;
  }
  console.log('parsing');
  let res = value(props);
  if(
    ([false, null].indexOf(res) === -1) &&
    (['number', 'string', 'undefined'].indexOf(typeof res) === -1)
  ) {
    res = undefined;
    console.warn('swiss parseFunction must return string or number');
  }
  return res;
}
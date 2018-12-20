export default value => {
  if (typeof value === 'undefined') {
    return '__undefined__';
  }
  if (
    value !== null &&
    (typeof value === 'object' || typeof value === 'function')
  ) {
    return value.toString();
  }
  return value;
};

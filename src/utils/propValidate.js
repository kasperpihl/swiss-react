export default (props, propName, componentName) => {
  componentName = componentName || 'ANONYMOUS';

  const value = props[propName];
  if (props[propName]) {
    if (typeof value !== 'object') {
      return 'expected object';
    }
  }

  // assume all ok
  return null;
}
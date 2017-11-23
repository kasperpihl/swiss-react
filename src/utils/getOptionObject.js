export default (options) => {
  if(typeof options === 'string') {
    return {
      element: options
    };
  }
  if(typeof options === 'object') {
    const {
      element,
      className
    } = options;
    if(typeof element === 'string' || typeof className === 'string') {
      options.element = options.element || 'div';
      return options;
    }
  }
  return null;
}
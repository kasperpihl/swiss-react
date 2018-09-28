export default props => {
  const dProps = {};
  Object.defineProperty(dProps, '__swissProps', {
    value: props
  });
  Object.defineProperty(dProps, '__swissDontForwardProps', {
    value: {}
  });
  Object.defineProperty(dProps, '__swissForwardedProps', {
    value: {}
  });
  Object.defineProperty(dProps, 'forwardProps', {
    value(...keys) {
      keys.forEach(k => {
        if (typeof k === 'string' && k) {
          this.__swissForwardedProps[k] = true;
          if (this.__swissDontForwardProps[k]) {
            delete this.__swissDontForwardProps[k];
          }
        }
      });
    }
  });
  Object.defineProperty(dProps, 'dontForwardProps', {
    value(...keys) {
      keys.forEach(k => {
        if (typeof k === 'string' && k && !this.__swissForwardedProps[k]) {
          this.__swissDontForwardProps[k] = true;
        }
      });
    }
  });

  Object.keys(props).forEach(k => {
    // ignore and remove all swiss internal props.
    if (k.startsWith('__swiss')) {
      return;
    }
    Object.defineProperty(dProps, k, {
      get() {
        if (!this.__swissDisableTouch && !this.__swissForwardedProps[k]) {
          this.__swissDontForwardProps[k] = true;
        }
        return this.__swissProps[k];
      },
      enumerable: true
    });
  });
  return dProps;
};

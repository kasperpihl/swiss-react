export default (props) => {
  const dProps = {};
  Object.defineProperty(dProps, '__swissProps', {
    value: props,
    writable: false,
    enumerable: false,
  });
  Object.defineProperty(dProps, '__swissTouchedProps', {
    enumerable: false,
    writable: true,
    value: {},
  });
  Object.defineProperty(dProps, 'markAsTouched', {
    value(...keys) {
      keys.forEach(k => {
        if(typeof k === 'string' && k) {
          this.__swissTouchedProps[k] = true;
        }
      })
    },
    writable: false,
    enumerable: false,
  })

  Object.keys(props).forEach((k) => {
    // ignore and remove all swiss internal props.
    if(k.startsWith('__swiss') || k === 'children') {
      return;
    }
    Object.defineProperty(dProps, k, {
      get() {
        this.__swissTouchedProps[k] = true;
        return this.__swissProps[k]
      },
      enumerable: true,
    });
  });
  return dProps;
}
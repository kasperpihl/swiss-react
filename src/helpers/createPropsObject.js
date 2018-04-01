export default (props) => {
  const lProps = {};

  Object.defineProperty(lProps, '__swissProps', {
    value: props,
    writable: false,
    enumerable: false,
  });
  Object.defineProperty(lProps, '__swissTouchedProps', {
    enumerable: false,
    writable: true,
    value: {},
  });

  Object.keys(props).forEach((k) => {
    Object.defineProperty(lProps, k, {
      get() {
        this.__swissTouchedProps[k] = true;
        return this.__swissProps[k]
      },
      enumerable: true,
    });
  });
  return lProps;
}
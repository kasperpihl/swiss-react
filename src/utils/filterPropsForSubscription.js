export default (subscription, props, dontForwardProps = []) => {
  const options = subscription.options;

  if(Array.isArray(options.dontForwardProps)) {
    dontForwardProps = dontForwardProps.concat(options.dontForwardProps);
  }
  const touched = subscription.props.__swissDontForwardProps;
  dontForwardProps = dontForwardProps.concat(Object.keys(touched));
  if(options.__touchedConditionalProps) {
    dontForwardProps = dontForwardProps.concat(Object.keys(options.__touchedConditionalProps));
  }
  let forwardProps = [];
  if(Array.isArray(options.forwardProps)) {
    forwardProps = forwardProps.concat(options.forwardProps);
  }

  const elementProps = {};
  const ignoredProps = [];

  Object.entries(props).forEach(([propName, propValue]) => {
    if(forwardProps.indexOf(propName) > -1 || dontForwardProps.indexOf(propName) === -1) {
      elementProps[propName] = propValue;
    } else if(!propName.startsWith('__swiss')){
      ignoredProps.push(propName);
    }
  });

  subscription.__swissForwardedProps = Object.keys(elementProps);
  subscription.__swissIgnoredProps = ignoredProps;
  
  return elementProps;
}
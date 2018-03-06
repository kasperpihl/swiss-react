import React from 'react';

let Provider;
let LocalConsumer;

if(typeof React.createContext !== 'undefined') {
  const context = React.createContext({});
  Provider = Context.Provider;
  LocalConsumer = Context.Consumer;
}

const LocalProvider = (props) => {
  const {
    children,
    ...rest,
  } = props;
  
  if(Provider) {
    return (
      <Provider value={rest}>
        {children}
      </Provider>
    )
  }
  return children;
};

export {
  LocalConsumer,
  LocalProvider,
}
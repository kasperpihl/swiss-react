import React from 'react';

let Context;
let Provider;
let GlobalConsumer;

if(typeof React.createContext !== 'undefined') {
  Context = React.createContext({});
  Provider = Context.Provider;
  GlobalConsumer = Context.Consumer;
}

const GlobalProvider = (props) => {
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
  GlobalConsumer,
  GlobalProvider,
}
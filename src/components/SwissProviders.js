import React, { PureComponent, createContext } from 'react';

const createContextClass = propKey => {
  const Context = createContext({});
  const Consumer = Context.Consumer;
  const Provider = props => {
    const { children, ...rest } = props;

    return <Context.Provider value={rest}>{children}</Context.Provider>;
  };

  return {
    Provider,
    Consumer
  };
};

const { Provider: SwissProvider, Consumer: SwissConsumer } = createContextClass(
  'providedProps'
);

const {
  Provider: SwissGlobalProvider,
  Consumer: SwissGlobalConsumer
} = createContextClass('globalProvidedProps');

export {
  SwissProvider,
  SwissConsumer,
  SwissGlobalProvider,
  SwissGlobalConsumer
};

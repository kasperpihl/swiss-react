import React, { PureComponent, createContext } from 'react';

const createContextClass = (propKey) => {
  let Provider;
  let Consumer = null;

  if(typeof createContext !== 'undefined') {
    const Context = createContext({});
    Consumer = Context.Consumer;
    Provider = (props) => {
      const {
        children,
        ...rest,
      } = props;
      
      return (
        <Context.Provider value={rest}>
          {children}
        </Context.Provider>
      );
    };
  } else {
    class ProvideProps extends PureComponent {
      getChildContext() {
        const {
          children,
          ...rest,
        } = this.props;

        return { [propKey]: rest };
      }
      render() {
        return this.props.children;
      }
    }

    ProvideProps.childContextTypes = {
      [propKey]: () => null,
    };
    Provider = ProvideProps;
  }

  return {
    Provider,
    Consumer,
  };
}

const {
  Provider: SwissProvider,
  Consumer: SwissConsumer
} = createContextClass('providedProps');

const {
  Provider:SwissGlobalProvider,
  Consumer:SwissGlobalConsumer,
} = createContextClass('globalProvidedProps');


export {
  SwissProvider,
  SwissConsumer,
  SwissGlobalProvider,
  SwissGlobalConsumer,
}
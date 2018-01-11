import './polyfills';
export { default as element } from './helpers/element';

export { addVariables } from './features/variables';

export { addMixin } from './features/mixins';

export { addGlobals } from './features/globals';

export { addPlugin } from './features/plugins';

export { addStyles } from './features/styles';

// react-swiss

export { default as SwissProvider } from './components/SwissProvider';

export { default as SwissController } from './classes/SwissController';

export * from './elements';

/*
<Div sw={[]}
[] HTML elements
[] addResetStyles
[] addGlobalStyles
[] addMixin
[] addVariables
[] addPlugin

withSwiss(WrappedComponent, {
  inlineStyles: true
});

react-swiss-core
react-swiss-dom
react-swiss-native

The idea is to store all styles in one element
As elements subscribe, their styles get added in the tree.
1. 
*/
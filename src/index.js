import './polyfills';
export { default as element } from './helpers/element';

export { addVariables } from './features/variables';

export { addMixin } from './features/mixins';

export { addGlobals } from './features/globals';

export { addPlugin } from './features/plugins';

export { addStyles } from './features/styles';

export { setGlobalOption, clearGlobalOption, getGlobalOption } from './features/options';
// react-swiss

export { default as SwissProvider } from './components/SwissProvider';

export { default as SwissController } from './classes/SwissController';
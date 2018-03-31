import './polyfills';
export { default as element } from './helpers/element';

export { addVariables } from './features/variables';

export { addMixin } from './features/mixins';

export { addGlobalStyles } from './features/global-styles';

export { addPlugin } from './features/plugins';

export { setOption } from './features/options';


// react specific stuff

export { SwissProvider, SwissGlobalProvider } from './components/SwissProviders';

export { SwissServerSide } from './components/SwissServerSide';

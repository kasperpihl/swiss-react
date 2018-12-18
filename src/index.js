import './polyfills';
import './features/default-plugins';
import './features/default-mixins';

export { addVariables } from './features/variables';

export { addMixin } from './features/mixins';

export { addGlobalStyles } from './features/global-styles';

export { addPlugin } from './features/plugins';

export { default as styleSheet } from './helpers/styleSheet';

// react specific stuff

export { default as SwissProvider } from './components/SwissProvider';

export { default as SwissServerSide } from './components/SwissServerSide';

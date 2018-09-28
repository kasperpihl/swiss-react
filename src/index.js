import "./polyfills";
import "./features/default-plugins";
import "./features/default-options";
import "./features/default-mixins";

export { default as styleElement } from "./helpers/styleElement";

export { addVariables } from "./features/variables";

export { addMixin } from "./features/mixins";

export { addGlobalStyles } from "./features/global-styles";

export { addPlugin } from "./features/plugins";

export { setOption } from "./features/options";

export { default as styleSheet } from "./helpers/styleSheet";

// react specific stuff

export {
  SwissProvider,
  SwissGlobalProvider
} from "./components/SwissProviders";

export { SwissServerSide } from "./components/SwissServerSide";

export { default as initSwiss } from "./helpers/initSwiss";

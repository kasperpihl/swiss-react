import { runDefaultMixin } from '../features/mixins';

export default options => {
  if (typeof options.styles !== 'object' || options.parsedDefaultMixins) return;
  for (let key in options.styles) {
    if (key.startsWith('_')) {
      runDefaultMixin(key, options.styles[key], (k, v) => {
        options[k] = v;
      });
    }
  }
  options.parsedDefaultMixins = true;
};

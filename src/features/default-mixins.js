import { addDefaultMixin } from './mixins';

addDefaultMixin('el', (setOption, el) => {
  if (['string', 'function', 'object'].indexOf(typeof el) > -1) {
    setOption('element', el);
  } else {
    console.warn(
      'swiss mixin "el" expects its argument to be a react component or an html element (string)'
    );
  }
});

addDefaultMixin('debug', (setOption, debug) => {
  setOption('debug', !!debug);
});

addDefaultMixin('inline', (setOption, inline) => {
  setOption('inline', !!inline);
});

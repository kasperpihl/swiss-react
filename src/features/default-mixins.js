import { addDefaultMixin } from './mixins';

addDefaultMixin('el', (setOption, el) => {
  if (
    typeof el === 'string' ||
    typeof el === 'function' ||
    typeof el === 'object'
  ) {
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

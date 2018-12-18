import convertStylesToArray from '../helpers/convertStylesToArray';
import DomHandler from '../classes/DomHandler';
import StyleParser from '../classes/StyleParser';

let gSubs = [];
const _domHandler = new DomHandler('globals');
let _timer;

function renderGlobals() {
  _domHandler.update(
    gSubs
      .map(options => {
        const [rawCss] = new StyleParser().run(options);
        return rawCss;
      })
      .filter(o => !!o)
      .join('')
  );
}
export function toString() {
  return _domHandler.toString();
}
export function toComponent() {
  return _domHandler.toComponent();
}

function addSubscription(className, selectors, value) {
  const options = {
    className,
    globals: true
  };
  if (typeof value === 'object') {
    options.styles = convertStylesToArray(value, selectors, {
      disableProps: true
    });
  } else {
    options.styles = `${className} ${value};\r\n`;
  }

  gSubs.push(options);
}

function iterateStyleObject(selectors, object) {
  if (typeof object !== 'object') {
    return;
  }
  Object.entries(object).forEach(([className, value]) => {
    if (!Array.isArray(value)) {
      value = [value];
    }
    value.forEach(v => {
      // Make sure media queries work in global styles
      if (className.startsWith('@media')) {
        return iterateStyleObject([className], v);
      }
      const selector = className.startsWith('@') ? className : '&';
      let theseSels = selectors.concat([selector]);
      addSubscription(className, theseSels, v);
    });
  });
}

export function addGlobalStyles(...globalsObj) {
  globalsObj.forEach(gO => {
    iterateStyleObject([], gO);
  });

  if (typeof window !== 'undefined') {
    window.cancelAnimationFrame(_timer);
    _timer = window.requestAnimationFrame(renderGlobals);
  } else {
    renderGlobals();
  }
}

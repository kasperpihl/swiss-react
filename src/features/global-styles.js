import convertStylesToArray from '../helpers/convertStylesToArray';
import DomHandler from '../classes/DomHandler';
import StyleParser from '../classes/StyleParser';
import { getOption } from './options';

let gSubs = [];
const _domHandler = new DomHandler('globals');
let _timer;

function renderGlobals() {
  _domHandler.update(gSubs.map(s => {
    if(!s.printedCss) {
      if(getOption('debug')) {
        s.options.debug = true; 
      } else {
        delete s.options.originalStyles;
      }
      new StyleParser(s).run();
    }
    return s.printedCss 
  }).filter(s => !!s).join(''));
}
export function toString() {
  return _domHandler.toString();
}
export function toComponent() {
  return _domHandler.toComponent();
}

function addSubscription(className, selectors, value) {
  const subscription = {
    className, 
    options: {
      globals: true,
      originalStyles: [ { [className]: value } ],
    }
  };
  if(typeof value === 'object') {
    subscription.options.styles = convertStylesToArray(value, selectors, {
      disableProps: true,
    });
  } else {
    subscription.printedCss = `${className} ${value};\r\n`;
    subscription.options.dontParse = true;
  }

  gSubs.push(subscription);
}

function iterateStyleObject(selectors, object) {
  if(typeof object !== 'object') {
    return;
  }
  Object.entries(object).forEach(([className, value]) => {
    if(!Array.isArray(value)) {
      value = [ value ];
    }
    value.forEach((v) => {
      // Make sure media queries work in global styles
      if(className.startsWith('@media')) {
        return iterateStyleObject([className], v);
      }
      const selector = className.startsWith('@') ? className : '&';
      let theseSels = selectors.concat([selector]);
      addSubscription(className, theseSels, v);
    })
  })
}

export function addGlobalStyles(...globalsObj) {
  globalsObj.forEach((gO) => {
    iterateStyleObject([], gO);
  });

  if(typeof window !== 'undefined') {
    window.cancelAnimationFrame(_timer);
    _timer = window.requestAnimationFrame(renderGlobals);
  } else {
    renderGlobals();
  }
}
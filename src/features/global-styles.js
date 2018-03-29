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

export function addGlobalStyles(...globalsObj) {
  globalsObj.forEach((gO) => {
    Object.entries(gO).forEach(([className, value]) => {
      if(!Array.isArray(value)) {
        value = [ value ];
      }
      value.forEach((v) => {
        const selector = className.startsWith('@') ? className : '&';
        const subscription = {
          className, 
          options: {
            globals: true,
            originalStyles: [ { [className]: v } ],
          }
        };
        if(typeof v === 'object') {
          subscription.options.styles = convertStylesToArray(v, [selector], {
            disableProps: true,
          });
        } else {
          subscription.printedCss = `${className} ${v};\r\n`;
          subscription.options.dontParse = true;
        }

        gSubs.push(subscription);
      })
      
    })
  });

  if(typeof window !== 'undefined') {
    window.cancelAnimationFrame(_timer);
    _timer = window.requestAnimationFrame(renderGlobals);
  } else {
    renderGlobals();
  }
}
import Parser from './parser';
import CSSPrinter from './css-printer';
import DomHandler from './utils/dom-handler';

let globals = [];
const _domEl = new DomHandler('globals');
_domEl.add();
let _timer;

function renderGlobals() {
  const parser = new Parser();
  const styleArray = parser.runGlobals(globals);
  const cssPrinter = new CSSPrinter(styleArray);

  _domEl.update(cssPrinter.print(false));
}

export function addGlobals(...globalsObj) {
  globals = globals.concat(globalsObj);
  if(typeof window !== 'undefined') {
    window.cancelAnimationFrame(_timer);
    _timer = window.requestAnimationFrame(renderGlobals);
  } else {
    renderGlobals();
  }
}
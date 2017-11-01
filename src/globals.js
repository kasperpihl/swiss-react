import Parser from './parser';
import CSSPrinter from './css-printer';
import DomHandler from './utils/DomHandler';

let globals = [];
const _domHandler = new DomHandler('globals');
_domHandler.add();
let _timer;

function renderGlobals() {
  const parser = new Parser();
  let styleArray = [];
  globals.forEach((styles) => {
    styleArray = styleArray.concat(parser.run(styles).styleArray);
  });

  const cssPrinter = new CSSPrinter(styleArray, []);

  _domHandler.update(cssPrinter.print(false));
}
export function toString() {
  return _domHandler.toString();
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
import Parser from './parser';
import printer from './printer';

let globals = [];
let _domEl;
let _childEl;
let _timer;

if(typeof document !== 'undefined') {
  _domEl = document.createElement('style');
  _domEl.type = 'text/css';
  _domEl.className = 'swiss-style';
  _domEl.id = `swiss-style-globals`;
  document.head.appendChild(_domEl);
}

function renderGlobals() {
  const parser = new Parser();
  const { styleArray } = parser.runGlobals(globals);

  if(typeof document === 'undefined') {
    return;
  }
  const printedCss = printer(styleArray);
  const newChildEl = document.createTextNode(printedCss);

  if(_childEl) {
    _domEl.replaceChild(newChildEl, _childEl);
  } else {
    _domEl.appendChild(newChildEl);
  }
  _childEl = newChildEl;
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
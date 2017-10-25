import Parser from './parser';
import printer from './printer';
const VARREGEX = /#{(.*?)}/gi;

export default class DomHandler {
  constructor(className, styles) {
    this.className = className;
    this.styles = styles;

    this.reset();

    this._updateDomElement = this._updateDomElement.bind(this);

    if(typeof document !== 'undefined') {
      this._domEl = document.createElement('style');
      this._domEl.type = 'text/css';
      this._domEl.className = 'swiss-style';
      this._domEl.id = `swiss-style-${className}`;
    }
  }
  getVariables() {
    return this.parser.getPropsInfo();
  }
  subscribe(props) {
    this._incrementRef();
    const refNum = ++this._totalCounter;
    this._props[refNum] = {};
    this._checkPropsAndUpdateDOM(refNum, props);
    return refNum;
  }
  update(id, props, oldProps) {
    this._checkPropsAndUpdateDOM(id, props, oldProps);
  }
  unsubscribe(id) {
    delete this._props[id];
    this._decrementRef();
  }
  reset() {
    this._refCounter = 0;
    this._totalCounter = 0;
    this._props = {};
    this.parser = new Parser(this.className, this.styles);
  }
  _checkPropsAndUpdateDOM(refNum, props, oldProps) {
    oldProps = oldProps || {};
    let needUpdate = false;

    this.getVariables().allProps.forEach((key) => {
      if((!oldProps[key] && props[key]) ||
        (props[key] && oldProps[key] && (''+props[key] !== oldProps[key]))) {
        this._props[refNum][key] = '' + props[key];
        needUpdate = true;
      }
      if(oldProps[key] && !props[key]) {
        delete this._props[refNum][key];
        needUpdate = true;
      }
    });

    if(needUpdate && typeof window !== 'undefined') {
      window.cancelAnimationFrame(this._updateFrame);
      this._updateFrame = window.requestAnimationFrame(this._updateDomElement);
    } else if(needUpdate) {
      this._updateDomElement();
    }
  }
  _updateDomElement() {
    const { styleArray } = this.parser.run(this._props);

    if(typeof document === 'undefined') {
      return;
    }
    const printedCss = printer(styleArray);
    const newChildEl = document.createTextNode(printedCss);

    if(this._childEl) {
      this._domEl.replaceChild(newChildEl, this._childEl);
    } else {
      this._domEl.appendChild(newChildEl);
    }
    this._childEl = newChildEl;
  }
  _addDomElement() {
    if(typeof document !== 'undefined') {
      document.head.appendChild(this._domEl);
    }
    
    this._updateDomElement();
    
  }
  _removeDomElement() {
    if(typeof document === 'undefined') {
      return;
    }
    document.head.removeChild(this._domEl);
    
  }
  _incrementRef() {
    this._refCounter++;
    if(this._refCounter === 1) {
      this._addDomElement();
    }
  }
  _decrementRef() {
    this._refCounter--;
    if(this._refCounter === 0) {
      this._removeDomElement();
    }
  }
}
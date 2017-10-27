import Parser from './parser';
import CSSPrinter from './css-printer';
import DomHandler from './utils/dom-handler';

export default class StyleHandler {
  constructor(className, styles) {
    this.className = className;
    this.styles = styles;

    this.reset();
    this._updateDomElement = this._updateDomElement.bind(this);
    this._domEl = new DomHandler(className);
  }
  getClassName() {
    return this.className;
  }
  getHandledProps(){ 
    return this.handledPropKeys;
  }
  subscribe(swissId, props) {
    this._incrementRef();
    this.runningPropValues[swissId] = {};
    this._checkPropsAndUpdateDOM(swissId, props);
  }
  update(swissId, props, oldProps) {
    this._checkPropsAndUpdateDOM(swissId, props, oldProps);
  }
  unsubscribe(swissId) {
    this._decrementRef();
  }
  reset() {
    this._refCounter = 0;
    this.runningPropValues = {};
    this.handledPropKeys = {
      all: [],
      keys: {},
      values: {},
    };

  }
  _generateStyleArrayAndPropsObject() {
    if (this.styleArray) {
      return;
    }
    const parser = new Parser();
    const all = new Set();
    const styleArray = parser.run(this.styles, this.className);
    this.cssPrinter = new CSSPrinter(styleArray);

    styleArray.forEach(({ valueProps }) => {
      if(valueProps) {
        Object.keys(valueProps).forEach((vP) => { 
          this.handledPropKeys.values[vP] = true; 
          all.add(vP);
        });
      }
    });

    Object.entries(this.styles).forEach(([key, val]) => {
      if (key !== 'default' && key.indexOf('=') > -1) {
        this.handledPropKeys.values[key.slice(0, key.indexOf('='))] = true;
        all.add(key.slice(0, key.indexOf('=')));
      } else if (key !== 'default') {
        this.handledPropKeys.keys[key] = true;
        all.add(key);
      }
    });
    this.handledPropKeys.all = [...all];
  }
  _checkPropsAndUpdateDOM(swissId, props, oldProps) {
    oldProps = oldProps || {};
    let needUpdate = false;

    this.handledPropKeys.all.concat('swiss').forEach((propKey) => {
      if(oldProps[propKey] !== props[propKey]) {
        if(typeof props[propKey] === 'undefined') {
          delete this.runningPropValues[swissId][propKey];
        } else {
          this.runningPropValues[swissId][propKey] = props[propKey];
        }
        needUpdate = true;
      }
    });

    if(needUpdate) {
      this._scheduleDOMUpdate();
    }
  }
  _scheduleDOMUpdate() {
    if(typeof window !== 'undefined') {
      window.cancelAnimationFrame(this._updateFrame);
      this._updateFrame = window.requestAnimationFrame(this._updateDomElement);
    } else {
      this._updateDomElement();
    }
  }
  _updateDomElement() {
    const dynamic = this.handledPropKeys.all.length;
    this._domEl.update(this.cssPrinter.print(dynamic, this.runningPropValues));
  }
  _incrementRef() {
    this._refCounter++;
    if(this._refCounter === 1) {
      this._generateStyleArrayAndPropsObject();
      this._domEl.add();
      this._scheduleDOMUpdate();
    }
  }
  _decrementRef() {
    this._refCounter--;
    if(this._refCounter === 0) {
      this._domEl.remove();
    }
  }
}
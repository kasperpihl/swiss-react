import Parser from './parser';
import Parser2 from './parse-components';
import CSSPrinter from './utils/css-printer';
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
    return this.handledPropKeys || [];
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
  }
  _generateStyleArrayAndPropsObject() {
    if (this.styleArray) {
      return;
    }

    const parser2 = new Parser2()
    const { allProps, styleArray } = parser2.run(this.styles.default, `.${this.className}`);
    this.cssPrinter = new CSSPrinter(styleArray, allProps);

    this.handledProps = allProps;
    this.styleArray = styleArray;
  }
  _checkPropsAndUpdateDOM(swissId, props, oldProps) {
    oldProps = oldProps || {};
    let needUpdate = false;

    this.handledProps.concat('swiss').forEach((propKey) => {
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
    const dynamic = this.handledProps.length;
    this._domEl.update(this.cssPrinter.print(this.runningPropValues));
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
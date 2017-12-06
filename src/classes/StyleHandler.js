import Parser from './Parser';
import CSSPrinter from './CSSPrinter';
import DomHandler from './DomHandler';

export default class StyleHandler {
  constructor(uniqueId, options, swissController) {
    
    this.swissController = swissController;
    this.className = options.className;
    this.styles = options.styles;

    this._refCounter = 0;
    this.runningPropValues = {};
    this._updateDomElement = this._updateDomElement.bind(this);
    this.domHandler = new DomHandler(this.className, options.name);
    this.domHandler.add();
  }
  toString() {
    return this.domHandler.toString();
  }
  getClassName() {
    return this.className;
  }
  getStyles() {
    return this.styles;
  }
  getHandledProps(){ 
    return this.handledProps || [];
  }
  subscribe(swissId, props) {
    this._incrementRef();
    this._checkPropsAndUpdateDOM(swissId, props, null, !!this.handledProps.length);
  }
  update(swissId, props, oldProps) {
    this._checkPropsAndUpdateDOM(swissId, props, oldProps);
  }
  unsubscribe(swissId) {
    this._decrementRef();
    delete this.runningPropValues[swissId];
  }
  _generateStyleArrayAndPropsObject() {
    if (this.styleArray) {
      return;
    }

    const parser = new Parser()
    const { allProps, styleArray } = parser.run(this.styles, `.${this.className}`);
    this.cssPrinter = new CSSPrinter(styleArray, allProps, this.swissController);

    this.handledProps = allProps;
    this.styleArray = styleArray;
  }
  _checkPropsAndUpdateDOM(swissId, props, oldProps, force) {
    oldProps = oldProps || {};
    let needUpdate = !!force;
    this.runningPropValues[swissId] = Object.assign({}, props);
    this.handledProps.concat('swiss').forEach((propKey) => {
      if(oldProps[propKey] !== props[propKey]) {
        if(propKey === 'swiss') {
          const parser = new Parser()
          this.runningPropValues[swissId].swiss = parser.run(props[propKey], `#${swissId}`).styleArray;
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
    this.domHandler.update(this.cssPrinter.print(this.runningPropValues));
  }
  _incrementRef() {
    this._refCounter++;
    if(this._refCounter === 1) {
      this._generateStyleArrayAndPropsObject();
      this._scheduleDOMUpdate();
    }
  }
  _decrementRef() {
    this._refCounter--;
    if(this._refCounter === 0) {
      this.domHandler.remove();
    }
  }
}
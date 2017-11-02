import StyleHandler from './style-handler';
import { toString } from './globals';

const stylesById = {};

export default class SwissController {
  constructor() {
    this.typeCounters = {};
    this.swissIds = {};
    this.styleHandlers = {};
  }
  addStylesForUniqueId(uniqueId, el, styles) {
    stylesById[uniqueId] = {
      el,
      styles
    };
  }
  getStylesByUniqueId(uniqueId) {
    return stylesById[uniqueId] && stylesById[uniqueId].styles;
  }
  getStyleHandler(uniqueString) {
    if(!this.styleHandlers[uniqueString]) {
      const { el, styles } = stylesById[uniqueString] || {};
      const typeClassname = this._getTypeClassname(el, styles);
      this.styleHandlers[uniqueString] = new StyleHandler(typeClassname, styles, this);
    }
    return this.styleHandlers[uniqueString];
  }
  toString() {
    let string = toString();
    Object.values(this.styleHandlers).forEach((sH) => {
      const styleString = sH.toString();
      if(styleString) {
        string += `${styleString}\r\n`;
      }
    })
    return string;
  }
  _getTypeClassname(el, styles, uniqueString) {
    if(typeof this.typeCounters[el] !== 'number') {
      this.typeCounters[el] = 0;
    }
    this.typeCounters[el]++;

    return `${el}-${this.typeCounters[el]}`;
  }
  getSwissId(uniqueString) {
    const styleHandler = this.getStyleHandler(uniqueString);
    const typeClassname = styleHandler.getClassName();
    if(typeof this.swissIds[typeClassname] !== 'number') {
      this.swissIds[typeClassname] = 0;
    }
    this.swissIds[typeClassname]++;

    return `${typeClassname}-${this.swissIds[typeClassname]}`;
  }
}
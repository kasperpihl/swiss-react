import StyleHandler from './StyleHandler';

import { toString } from '../features/globals';

const globalOptionsById = {};

export default class SwissController {
  constructor(isDefault) {
    this.isDefault = isDefault;
    this.typeCounters = {};
    this.swissIds = {};
    this.styleHandlers = {};
  }
  addStylesForUniqueId(uniqueId, options) {
    if(globalOptionsById[uniqueId]) {
      globalOptionsById[uniqueId] = Object.assign({}, globalOptionsById[uniqueId], options);
    } else {
      globalOptionsById[uniqueId] = options;
    }
  }
  getOptionsByUniqueId(uniqueId) {
    return globalOptionsById[uniqueId];
  }
  getStylesByUniqueId(uniqueId) {
    return globalOptionsById[uniqueId] && globalOptionsById[uniqueId].styles;
  }
  getStyleHandler(uniqueString) {
    if(!this.styleHandlers[uniqueString]) {

      const options = Object.assign({}, globalOptionsById[uniqueString]);
      options.className = options.className || this._getTypeClassname(options);
      this.styleHandlers[uniqueString] = new StyleHandler(uniqueString, options, this);
      
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
  _getTypeClassname(options) {
    let el = options.element;
    if(typeof el !== 'string') {
      el = 'div';
    }
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
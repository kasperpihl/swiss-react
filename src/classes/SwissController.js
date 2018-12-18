import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import { toString, toComponent } from '../features/global-styles';

export default class SwissController {
  constructor() {
    this.shouldUpdateDOM = false;
    this.domHandler = new DomHandler('newglobal');
    this.domHandler.add();
    this.stylesToAppend = [];
    this.classNameCache = {};
  }
  filterProps(className, keyValues, props, context) {
    const filteredProps = {
      className: className
        .split('.')
        .concat(props.className)
        .filter(v => !!v)
        .join(' ')
    };
    const exclude = ['className', 'innerRef'];

    Object.entries(props).forEach(([propName, propValue]) => {
      if (
        !keyValues[propName] &&
        !propName.startsWith('__swiss') &&
        typeof context.contextProps[propName] === 'undefined' &&
        exclude.indexOf(propName) === -1
      ) {
        filteredProps[propName] = propValue;
      }
    });
    return filteredProps;
  }
  parsePropToPrimitive(value) {
    if (typeof value === 'object' || typeof value === 'function') {
      return value.toString();
    }
    return value;
  }
  checkCacheForClassName(props, context) {
    const type = props.__swissOptions.type;

    // Lazy load cache.
    if (!this.classNameCache[type]) {
      this.classNameCache[type] = [];
    }
    let foundCache;
    this.classNameCache[type].forEach(cache => {
      if (foundCache) return;
      let allWasEqual = true;
      for (let key in cache.keyValues) {
        let value = props[key];
        if (typeof value === 'undefined') {
          value = context.contextProps[key];
        }
        if (cache.keyValues[key] !== this.parsePropToPrimitive(value)) {
          allWasEqual = false;
        }
      }
      if (allWasEqual) {
        foundCache = cache;
      }
    });
    return foundCache ? foundCache : this.createStyles(props, context);
  }
  prepareToRender(props, context) {
    const { className, keyValues } = this.checkCacheForClassName(
      props,
      context
    );

    const contextOpt = context.options;
    const elementOpt = props.__swissOptions;

    const filteredProps = this.filterProps(
      className,
      keyValues,
      props,
      context
    );

    return [elementOpt.element || contextOpt.defaultEl, filteredProps];
  }
  createStyles(props, context) {
    const type = props.__swissOptions.type;
    const index = this.classNameCache[type].length;
    const className = `.${props.__swissOptions.type}.sw${index}`;

    const subscription = {
      className,
      options: Object.assign({}, context.options, props.__swissOptions)
    };

    const touchedProps = {};
    const getProp = (key, fallbackValue) => {
      let value = props[key];
      if (typeof value === 'undefined') {
        value = context.contextProps[key];
      }
      touchedProps[key] = this.parsePropToPrimitive(value);
      return typeof value === 'undefined' ? fallbackValue : value;
    };
    new StyleParser(subscription).run(getProp);

    const record = {
      className,
      keyValues: touchedProps
    };

    this.classNameCache[type].push(record);

    this.stylesToAppend.push(subscription.printedCss);

    return record;
  }
  toString = () => {
    this.checkIfDomNeedsUpdate(true);
    return toString() + '\r\n' + this.domHandler.toString();
  };
  toComponents = () => {
    this.checkIfDomNeedsUpdate(true);
    return [toComponent(), this.domHandler.toComponent()].filter(v => !!v);
  };
  checkIfDomNeedsUpdate() {
    if (this.stylesToAppend.length) {
      // Update DOM!
      console.log(this.stylesToAppend);
      this.domHandler.append(this.stylesToAppend.join('\r\n'));
      this.stylesToAppend = [];
    }
  }
}

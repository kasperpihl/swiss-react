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

  prepareToRender(props, context) {
    const { keyValues, passedOnProps } = this.checkCacheForClassName(
      props,
      context
    );

    const contextOpt = context.options;
    const elementOpt = props.__swissOptions;

    const filteredProps = this.filterProps(
      keyValues,
      passedOnProps,
      props,
      context
    );

    return [elementOpt.element || contextOpt.defaultEl, filteredProps];
  }

  filterProps(keyValues, passedOnProps, props, context) {
    const filteredProps = {};
    if (passedOnProps.className || props.className) {
      filteredProps.className = (passedOnProps.className || '')
        .split('.')
        .concat(props.className)
        .filter(v => !!v)
        .join(' ');
    }
    if (passedOnProps.style || props.style) {
      filteredProps.style = Object.assign({}, passedOnProps.style, props.style);
    }
    const exclude = ['className', 'innerRef', 'style'];

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
    let inline = props.__swissOptions.inline;
    if (typeof inline === 'undefined') inline = context.options.inline;

    // Lazy load cache.
    if (!this.classNameCache[type]) {
      this.classNameCache[type] = [];
    }
    let foundCache;
    this.classNameCache[type].forEach(cache => {
      if (foundCache || cache.inline !== inline) return;
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
  createStyles(props, context) {
    const type = props.__swissOptions.type;
    const index = this.classNameCache[type].length;
    const className = `.${props.__swissOptions.type}.sw${index}`;

    const touchedProps = {};
    const getProp = (key, fallbackValue) => {
      let value = props[key];
      if (typeof value === 'undefined') {
        value = context.contextProps[key];
      }
      touchedProps[key] = this.parsePropToPrimitive(value);
      return typeof value === 'undefined' ? fallbackValue : value;
    };

    const options = Object.assign({}, context.options, props.__swissOptions, {
      className
    });
    const [rawCss, inlineStyles] = new StyleParser().run(options, getProp);

    const passedOnProps = {};
    if (options.inline) {
      passedOnProps.style = inlineStyles;
    } else {
      passedOnProps.className = className;
      this.stylesToAppend.push(rawCss);
    }

    const record = {
      passedOnProps,
      inline: options.inline,
      keyValues: touchedProps
    };

    this.classNameCache[type].push(record);

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
    console.log(this.classNameCache);
    if (this.stylesToAppend.length) {
      // Update DOM!

      this.domHandler.append(this.stylesToAppend.join('\r\n'));
      this.stylesToAppend = [];
    }
  }
}

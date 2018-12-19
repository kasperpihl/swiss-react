import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import debugLogger from '../helpers/debugLogger';
import { toString, toComponent } from '../features/global-styles';

export default class SwissController {
  constructor() {
    this.shouldUpdateDOM = false;
    this.domHandler = new DomHandler('newglobal');
    this.domHandler.add();
    this.stylesToAppend = [];
    this.cacheByType = {};

    // Counting render cycles for nice logging.
    this.renderCycles = 0;
    this.didFinishCycle = true;
  }

  prepareToRender(props, context) {
    // Used to know if we hit the cache.
    this.cacheHit = false;
    // Counting cycles for nice debugging experience.
    if (this.didFinishCycle) {
      this.renderCycles++;
      this.didFinishCycle = false;
    }

    const stylesLengthBef = this.stylesToAppend.length;
    const startTime = new Date();

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

    if (contextOpt.debug || elementOpt.debug) {
      debugLogger({
        cacheHit: this.cacheHit,
        renderCycles: this.renderCycles,
        props,
        context,
        startTime,
        endTime: new Date(),
        filteredProps,
        keyValues,
        passedOnProps,
        // If we added any css it will be the last element
        generatedCss: this.stylesToAppend[stylesLengthBef]
      });
    }

    return [elementOpt.element || contextOpt.defaultEl, filteredProps];
  }

  filterProps(keyValues, passedOnProps, props, context) {
    const filteredProps = {};
    if (passedOnProps.className || props.className) {
      filteredProps.className = [passedOnProps.className, props.className]
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
    if (!this.cacheByType[type]) {
      this.cacheByType[type] = [];
    }
    let foundCache;
    this.cacheByType[type].forEach(cache => {
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

    // Used for showing in the debug log
    if (foundCache) this.cacheHit = true;

    return foundCache ? foundCache : this.createStyles(props, context);
  }
  createStyles(props, context) {
    const type = props.__swissOptions.type;
    const index = this.cacheByType[type].length;
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
      passedOnProps.className = className
        .split('.')
        .filter(v => !!v)
        .join(' ');
      this.stylesToAppend.push(rawCss);
    }

    const record = {
      passedOnProps,
      inline: options.inline,
      keyValues: touchedProps
    };

    this.cacheByType[type].push(record);

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
    this.didFinishCycle = true;
    if (this.stylesToAppend.length) {
      // Update DOM!
      this.domHandler.append(this.stylesToAppend.join('\r\n'));
      this.stylesToAppend = [];
    }
  }
}

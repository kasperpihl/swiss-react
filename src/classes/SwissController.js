import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import debugLogger from '../helpers/debugLogger';
import { getGlobalStyles } from '../features/global-styles';

let totalTime = 0;
export default class SwissController {
  constructor(disableHydration) {
    this.shouldUpdateDOM = false;
    this.domHandler = new DomHandler('swiss-styles');
    this.domHandler.add();
    this.stylesToAppend = getGlobalStyles();
    this.cacheByType = {};
    if (typeof window !== 'undefined' && window.__swissHydration) {
      if (!disableHydration) {
        this.cacheByType = window.__swissHydration;
      }
      const element = document.getElementById('swiss-hydration');
      element.parentNode.removeChild(element);
      delete window.__swissHydration;
    }
  }

  prepareToRender(props, context) {
    // Debugging start
    // Used to know if we hit the cache.
    this.cacheHit = true;
    const stylesLengthBef = this.stylesToAppend.length;
    const startTime = new Date();
    // Debugging end

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

    totalTime += new Date().getTime() - startTime.getTime();
    if (contextOpt.debug || elementOpt.debug) {
      if (!this.isDebuggingRenderCycle) {
        this.renderCycles = this.renderCycles ? this.renderCycles + 1 : 1;
        this.isDebuggingRenderCycle = true;
      }
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
        typeof keyValues[propName] === 'undefined' &&
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
    if (typeof value === 'undefined') {
      return '__undefined__';
    }
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

    // Support for disabling cache (always recalculate styles)
    if (context.options.disableCache) {
      return this.createStyles(props, context);
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
    return foundCache ? foundCache : this.createStyles(props, context);
  }
  createStyles(props, context) {
    this.cacheHit = false;
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
  checkIfDomNeedsUpdate() {
    this.isDebuggingRenderCycle = undefined;

    if (this.stylesToAppend.length) {
      console.log(
        'total time looking up in cache and calculating styles',
        totalTime
      );
      totalTime = 0;
      // Update DOM!
      this.domHandler.append(this.stylesToAppend.join('\r\n'));
      this.stylesToAppend = [];
    }
  }
}

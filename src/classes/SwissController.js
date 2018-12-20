import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import debugLogger from '../helpers/debugLogger';
import parseToPrimitive from '../utils/parseToPrimitive';
import { getGlobalStyles } from '../features/global-styles';

export default class SwissController {
  constructor(disableHydration) {
    // Setup the dom node with #swiss-styles
    this.domHandler = new DomHandler('swiss-styles');

    // stylesToAppend keeps track of css we need to add to the DOM
    // Load our global styles as initial value to ensure they're added
    this.stylesToAppend = getGlobalStyles();

    // Caching mechanism
    this.cacheByType = {};

    // Hydrate the cache, if any
    if (typeof window !== 'undefined' && window.__swissHydration) {
      // support to disable hydration
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
    const stylesLengthBef = this.stylesToAppend.length;
    const startTime = new Date();
    // Debugging end
    let cacheHit = true;
    let cache = this.checkCacheForClassName(props, context);
    if (!cache) {
      cacheHit = false;
      cache = this.createStyles(props, context);
    }

    const contextOpt = context.options;
    const elementOpt = props.__swissOptions;

    const filteredProps = this.filterProps(cache, props, context);

    if (contextOpt.debug || elementOpt.debug) {
      if (!this.isDebuggingRenderCycle) {
        this.renderCycles = this.renderCycles ? this.renderCycles + 1 : 1;
        this.isDebuggingRenderCycle = true;
      }
      debugLogger({
        cacheHit,
        renderCycles: this.renderCycles,
        props,
        context,
        startTime,
        endTime: new Date(),
        filteredProps,
        cache,
        // If we added any css it will be the last element
        generatedCss: this.stylesToAppend[stylesLengthBef]
      });
    }

    return [elementOpt.element || contextOpt.defaultEl, filteredProps];
  }

  filterProps(cache, props, context) {
    const { passedOnProps, keyValues } = cache;
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
        if (cache.keyValues[key] !== parseToPrimitive(value)) {
          allWasEqual = false;
        }
      }
      if (allWasEqual) {
        foundCache = cache;
      }
    });
    return foundCache;
  }
  createStyles(props, context) {
    const type = props.__swissOptions.type;
    const index = this.cacheByType[type].length;
    const className = `.${type}.sw${index}`;

    const touchedProps = {};
    const getProp = (key, fallbackValue) => {
      let value = props[key];
      if (typeof value === 'undefined') {
        value = context.contextProps[key];
      }
      touchedProps[key] = parseToPrimitive(value);
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
  componentDidRender() {
    this.isDebuggingRenderCycle = undefined;

    if (this.stylesToAppend.length) {
      // Update DOM!
      this.domHandler.append(this.stylesToAppend.join('\r\n'));
      this.stylesToAppend = [];
    }
  }
}

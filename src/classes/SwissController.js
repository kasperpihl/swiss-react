import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import debugLogger from '../helpers/debugLogger';
import parseToPrimitive from '../utils/parseToPrimitive';
import convertStylesToArray from '../helpers/convertStylesToArray';
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
        this.cacheByType = window.__swissHydration.cacheByType;
      }
      const element = document.getElementById('swiss-hydration');
      element.parentNode.removeChild(element);
      delete window.__swissHydration;
    }
  }

  prepareToRender(props, options, context, lastCacheIndex) {
    // Debugging start
    const stylesLengthBef = this.stylesToAppend.length;
    const startTime = new Date();
    // Debugging end
    let cacheHit = true;
    let [cacheIndex, cache] = this.checkCacheForClassName(
      props,
      options,
      context,
      lastCacheIndex
    );
    if (!cache) {
      cacheHit = false;
      [cacheIndex, cache] = this.createStyles(props, options, context);
    }

    const contextOpt = context.options;

    const filteredProps = this.filterProps(cache, props, context);

    if (contextOpt.debug || options.debug) {
      if (!this.isDebuggingRenderCycle) {
        this.renderCycles = this.renderCycles ? this.renderCycles + 1 : 1;
        this.isDebuggingRenderCycle = true;
      }
      debugLogger({
        cacheHit,
        renderCycles: this.renderCycles,
        props,
        context,
        options,
        startTime,
        endTime: new Date(),
        filteredProps,
        cache,
        // If we added any css it will be the last element
        generatedCss: this.stylesToAppend[stylesLengthBef]
      });
    }

    return [options.element || contextOpt.defaultEl, filteredProps, cacheIndex];
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
        typeof context.contextProps[propName] === 'undefined' &&
        exclude.indexOf(propName) === -1
      ) {
        filteredProps[propName] = propValue;
      }
    });
    return filteredProps;
  }
  checkCacheForClassName(props, options, context, lastCacheIndex = 0) {
    const type = options.type;
    let inline = options.inline;
    if (typeof inline === 'undefined') inline = context.options.inline;

    // Lazy load cache.
    if (!this.cacheByType[type]) {
      this.cacheByType[type] = [];
    }

    // Support for disabling cache (always recalculate styles)
    if (context.options.disableCache) {
      return this.createStyles(props, context);
    }

    const cacheToSearch = this.cacheByType[type];

    for (let i = 0; i < cacheToSearch.length; i++) {
      // Doing some magic starting on the index it was last, if any :)
      const cache = cacheToSearch[(i + lastCacheIndex) % cacheToSearch.length];
      if (cache.inline !== inline) continue;
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
        return [i, cache];
      }
    }
    return [-1, null];
  }
  createStyles(props, options, context) {
    const type = options.type;
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

    if (!options.convertedStyles) {
      options.convertedStyles = [
        {
          selectors: ['&'],
          type: 'nested',
          condition: null,
          key: '&',
          value: convertStylesToArray(options.styles, ['&'], {}, (k, v) => {
            options[k] = v;
          })
        }
      ];
      delete options.styles;
    }
    const mergedOptions = Object.assign({}, context.options, options, {
      className
    });
    const [rawCss, inlineStyles] = new StyleParser().run(
      mergedOptions,
      getProp
    );

    const passedOnProps = {};
    if (mergedOptions.inline) {
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
      inline: mergedOptions.inline,
      keyValues: touchedProps
    };

    this.cacheByType[type].push(record);
    return [index, record];
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

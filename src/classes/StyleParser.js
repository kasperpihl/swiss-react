import parseProps from '../helpers/parseProps';
import parseFunctional from '../helpers/parseFunctional';
import { parseVariables } from '../features/variables';
import { logSubscription } from '../helpers/logger';

import { runMixin, getMixin } from '../features/mixins';
import { runPlugin } from '../features/plugins';

import { testCondition } from '../utils/conditions';
import printToCss from '../utils/printToCss';

export default class StyleParser {
  constructor(subscription) {
    this.sub = subscription;
  }

  run() {
    const startTime = new Date();
    let rawCss = this.sub.printedCss;
    if(this.sub.options.styles && !this.sub.options.dontParse) {
      this.printStyleArray = [];
      this.runningQueue = [...this.sub.options.styles];
      this.nextQueue = [];

      this.sub.inlineStyles = {};

      this.sub.touched = {
        mixins: {},
        variables: {},
      }
      this.runQueue();
      if(this.printStyleArray.length) {
        this.replacePropsAndVarForSelectors(this.printStyleArray);
        rawCss = printToCss(this.printStyleArray);
      }
    }

    this.sub.printedCss = runPlugin(
      'parseRawCss',
      rawCss,
      this.sub.props,
    );

    logSubscription(this.sub, startTime);
  }
  runQueue() {
    while (this.runningQueue.length) {
      const node = this.runningQueue.shift();
      const { props, touched } = this.sub;
      switch(node.type) {
        case 'mixin': {
          // On mixins, inject on current queue, to keep hierachy
          const mixinValue = runMixin(node, props);
          touched.mixins[node.key] = true;
          if(Array.isArray(mixinValue)) {
            this.runningQueue = mixinValue.concat(this.runningQueue);
          }
          break;
        }
        case 'array': {
          // On array, inject on current queue, to keep hierachy
          this.runningQueue = node.value.concat(this.runningQueue);
          break;
        }
        case 'nested': {
          // Only parse the children if condition is met
          if(!node.condition || testCondition(node.condition, props)) {
            this.nextQueue = this.nextQueue.concat(node.value);
          }
          break;
        }
        case 'node': {
          this.handleNode(node);
          break;
        }
      }
    } 
    if(this.nextQueue.length) {
      this.runningQueue = this.nextQueue;
      this.nextQueue = [];
      this.runQueue();
    }
  }
  replacePropsAndVarForSelectors(array) {
    const { props, className, touched } = this.sub;
    array.forEach((obj) => {
      obj.selector = parseProps(obj.selector, props);
      obj.selector = parseVariables(obj.selector, touched.variables);
      // TODO: support comma separated stuff.
      obj.selector = className.split(/,\ ?/g).map(s => obj.selector.replace(/&/gi, s)).join(', ');
      if(obj.children.length) {
        this.replacePropsAndVarForSelectors(obj.children);
      }
    });
  }
  findTargetFromSelectors(selectors) {
    // Support iterative structere with children
    let dRes = { children: this.printStyleArray };
    selectors.forEach((selector) => {
      let index = dRes.children.findIndex(o => o.selector === selector);
      if(index === -1) {
        index = dRes.children.push({
          selector,
          children: [],
          styles: [],
        }) - 1;
      }
      dRes = dRes.children[index];
    })
    return dRes;
  }
  handleNode(node) {
    let key = node.key;
    let value = node.value;

    value = parseFunctional(value, this.sub.props);
    value = parseProps(value, this.sub.props);
    value = parseVariables(value, this.sub.touched.variables);
    
    runPlugin('parseKeyValue', (handler) => {
      const res = handler(key, value, this.sub.props);
      if(typeof res !== 'object' || typeof res.key !== 'string') {
        return console.warn('swiss plugin error for: parseKeyValue. Expected object with key and value.');
      }
      key = res.key;
      value = res.value;
    });
    // value is nothing, but accept 0
    if(typeof value !== 'number' && !value) return;

    // If inline, just override the values.
    if(this.sub.options.inline) {
      this.sub.inlineStyles[key] = value;
    } else {
      // Else figure out order and stuff
      const target = this.findTargetFromSelectors(node.selectors);

      const sIndex = target.styles.findIndex(o => o.key === key);
      if(sIndex > -1 && !node.append) {
        target.styles.splice(sIndex, 1);
      }

      target.styles.push({
        key,
        value,
      });
    }
  }
}
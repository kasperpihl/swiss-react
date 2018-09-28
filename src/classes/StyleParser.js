import parseProps from '../helpers/parseProps';
import parseFunctional from '../helpers/parseFunctional';
import { parseVariables } from '../features/variables';
import { logSubscription } from '../helpers/logger';

import convertStylesToArray from '../helpers/convertStylesToArray';
import { runMixin, getMixin } from '../features/mixins';
import {
  parseKeyValue,
  parseRawCss,
  parseRawInline
} from '../features/plugins';

import testCondition from '../utils/testCondition';
import printToCss from '../utils/printToCss';

export default class StyleParser {
  constructor(subscription) {
    this.sub = subscription;
  }

  run() {
    const startTime = new Date();
    let rawCss = this.sub.printedCss;
    const { options } = this.sub;
    if (options.styles && !options.dontParse) {
      this.printStyleArray = [];
      this.runningQueue = [...options.styles];

      this.sub.inlineStyles = {};

      this.sub.touched = {
        mixins: {},
        variables: {}
      };
      this.runQueue();
      if (this.printStyleArray.length) {
        this.replacePropsAndVarForSelectors(this.printStyleArray);
        rawCss = printToCss(this.printStyleArray);
      }
    }

    // Run post plugins. (parseRawInline, parseRawCss)
    if (options.inline) {
      this.sub.inlineStyles = parseRawInline(
        this.sub.inlineStyles,
        this.sub.props
      );
    } else {
      this.sub.printedCss = parseRawCss(rawCss || '', this.sub.props);
    }

    if (options.debug) {
      // Hack to make sure that render has been called and we know which props was forwarded and which was not.
      setTimeout(() => {
        logSubscription(this.sub, startTime);
      }, 1);
    }
  }
  runQueue() {
    if (!this.runningQueue.length) return;

    const node = this.runningQueue.shift();

    const { props, touched } = this.sub;
    switch (node.type) {
      case 'mixin': {
        // inject on current queue, to keep hierachy
        let mixinValue = runMixin(node, props, touched);
        if (mixinValue) {
          mixinValue = convertStylesToArray(mixinValue, node.selectors);
        }
        if (Array.isArray(mixinValue)) {
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
        if (!node.condition || testCondition(node.condition, props)) {
          if (node.condition) {
            node.value.forEach(n => {
              const length = n.selectors.length;
              if (n.selectors[length - 1].indexOf(', .sw_') === -1) {
                n.selectors[length - 1] += `, .sw_${node.condition.key}`;
              }
            });
          }
          this.runningQueue = node.value.concat(this.runningQueue);
        }
        break;
      }
      case 'node': {
        this.handleNode(node);
        break;
      }
    }
    this.runQueue();
  }
  replacePropsAndVarForSelectors(array) {
    const { props, className, touched } = this.sub;
    array.forEach(obj => {
      obj.selector = parseProps(obj.selector, props);
      obj.selector = parseVariables(obj.selector, touched.variables);
      // TODO: support comma separated stuff.
      obj.selector = className
        .split(/,\ ?/g)
        .map(s => obj.selector.replace(/&/gi, s))
        .join(', ');
      if (obj.children.length) {
        this.replacePropsAndVarForSelectors(obj.children);
      }
    });
  }
  findTargetFromSelectors(selectors) {
    // Support iterative structere with children
    let dRes = { children: this.printStyleArray };
    selectors.forEach(selector => {
      const length = dRes.children.length;
      let index = length - 1;
      if (!length || dRes.children[length - 1].selector !== selector) {
        index =
          dRes.children.push({
            selector,
            children: [],
            styles: []
          }) - 1;
      }
      dRes = dRes.children[index];
    });
    return dRes;
  }
  handleNode(node) {
    let key = node.key;
    let value = node.value;

    const { props, touched, options, inlineStyles } = this.sub;

    value = parseFunctional(value, props);
    value = parseProps(value, props);
    value = parseVariables(value, touched.variables);

    const res = parseKeyValue(key, value, props);
    key = res[0];
    value = res[1];

    // value is nothing, but accept 0
    if (typeof value !== 'number' && !value) return;

    // If inline, just override the values.
    if (options.inline) {
      inlineStyles[key] = value;
    } else {
      // Else figure out order and stuff
      const target = this.findTargetFromSelectors(node.selectors);

      const sIndex = target.styles.findIndex(o => o.key === key);
      if (sIndex > -1 && !node.append) {
        target.styles.splice(sIndex, 1);
      }

      target.styles.push({
        key,
        value
      });
    }
  }
}

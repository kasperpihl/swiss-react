import createSubscription from '../helpers/createSubscription';
import CSSPrinter from './CSSPrinter';
import DomHandler from './DomHandler';
import inliner from '../helpers/inliner';
import { toString } from '../features/globals';

export default class SwissController {
  constructor(isDefault) {
    this.refCounter = 0;
    this.subscriptions = [];
    this.needUpdates = {};
    this.shouldUpdate = false;
    this.domHandler = new DomHandler('newglobal');
    this.domHandler.add();
  }
  subscribe(props) {
    const ref = ++this.refCounter;
    const subscription = createSubscription(ref, props);
    const index = this.subscriptions.push(subscription) - 1;
    this.needUpdates[ref] = true;
    this.shouldUpdate = true;
    return subscription;
  }
  update(ref, props, oldProps) {
    const subscription = this.subscriptions.find(s => s.ref === ref);
    if(subscription) {
      subscription.parsedStyles.allProps.forEach((propKey) => {
        if(oldProps[propKey] !== props[propKey]) {
          this.needUpdates[ref] = true;
          this.shouldUpdate = true;
        }
      });
      subscription.props = props;
    }
  }
  unsubscribe(ref) {
    const index = this.subscriptions.findIndex(s => s.ref === ref);
    if(index > -1) {
      this.subscriptions.splice(index, 1);
      this.shouldUpdate = true;
    }
  }
  getInlineStyles(ref) {
    const s = this.subscriptions.find(s => s.ref === ref);
    if(this.needUpdates[ref] || !s.inlineStyles) {
      s.inlineStyles = inliner(s.parsedStyles.styleArray, s.props);
      delete this.needUpdates[ref];
    }
    return s.inlineStyles;
  }
  _getPrintedStyles() {
    return this.subscriptions.map((s) => {
      if(this.needUpdates[s.ref] || typeof s.rawStyles !== 'string') {
        const printer = new CSSPrinter(s.parsedStyles.styleArray, s.parsedStyles.allProps);
        s.rawStyles = printer.print(s.props);
      }
      return s.rawStyles;
    }).filter(s => !!s).join('');
  }
  toString() {
    this.updateDom(true);
    return toString() + '\r\n' + this.domHandler.toString();
  }
  updateDom(force) {
    if(this.shouldUpdate || force) {
      // Update DOM!
      const css = this._getPrintedStyles();
      this.domHandler.update(css);
      this.needUpdates = {};
      this.shouldUpdate = false;
    }
  }
}
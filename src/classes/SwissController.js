import createSubscription from '../helpers/createSubscription';
import CSSPrinter from './CSSPrinter';
import DomHandler from './DomHandler';
import inliner from '../helpers/inliner';
import { toString } from '../features/globals';

export default class SwissController {
  constructor(isDefault) {
    this.refCounter = 0;
    this.subscriptions = [];
    this.shouldUpdateDOM = false;
    this.domHandler = new DomHandler('newglobal');
    this.domHandler.add();
  }
  subscribe(props) {
    const ref = ++this.refCounter;
    const subscription = createSubscription(ref, props);
    const index = this.subscriptions.push(subscription) - 1;
    this.ensureStyles(subscription);
    this.shouldUpdateDOM = true;
    return subscription;
  }
  update(ref, props, oldProps) {
    const subscription = this.subscriptions.find(s => s.ref === ref);

    if(subscription) {
      this.shouldUpdateDOM = true;
      subscription.props = props;
      this.ensureStyles(subscription);
    }
  }
  unsubscribe(ref) {
    const index = this.subscriptions.findIndex(s => s.ref === ref);
    if(index > -1) {
      this.subscriptions.splice(index, 1);
      this.shouldUpdateDOM = true;
    }
  }
  ensureStyles(subscription) {
    // Ensure either inline or raw css depending on options
    if(subscription.props.__swissOptions.inline) {
      const {
        touchedProps,
        inlineStyles,
      } = inliner(s.parsedStyles.styleArray, s.props);
      s.inlineStyles = inlineStyles;
      s.touchedProps = touchedProps;
    } else {
      const printer = new CSSPrinter(subscription.parsedStyles.styleArray);
      const {
        printedCss,
        touchedProps,
      } = printer.print(subscription.props);
      subscription.rawStyles = printedCss;
      subscription.touchedProps = touchedProps;
    }
  }
  _getPrintedStyles() {
    return this.subscriptions.map(s => s.rawStyles).filter(s => !!s).join('');
  }
  toString() {
    this.updateDom(true);
    return toString() + '\r\n' + this.domHandler.toString();
  }
  updateDom(force) {
    if(this.shouldUpdateDOM || force) {
      // Update DOM!
      const css = this._getPrintedStyles();
      this.domHandler.update(css);
      this.shouldUpdateDOM = false;
    }
  }
}

const defaultSwissController = new SwissController();

export {
  defaultSwissController,
}
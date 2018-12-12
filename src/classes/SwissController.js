import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import { toString, toComponent } from '../features/global-styles';
import createPropsObject from '../helpers/createPropsObject';

export default class SwissController {
  constructor() {
    this.refCounter = 0;
    this.subscriptions = [];
    this.shouldUpdateDOM = false;
    this.domHandler = new DomHandler('newglobal');
    this.domHandler.add();
  }
  subscribe(props) {
    const subscription = {
      ref: this.refCounter,
      className: `.${props.__swissOptions.className || 'swiss'}-${
        this.refCounter
      }`,
      options: props.__swissOptions,
      orgProps: props,
      props: createPropsObject(props)
    };
    this.refCounter++;
    this.subscriptions.push(subscription);
    new StyleParser(subscription).run();
    this.shouldUpdateDOM = true;
    window.styleHandler.updateSubscriptions(this.subscriptions);
    return subscription;
  }
  update(subscription, props) {
    if (subscription) {
      let shouldUpdateStyles = true;
      if (subscription.options.pure) {
        shouldUpdateStyles = false;
        subscription.options.pure.forEach(propName => {
          if (subscription.props[propName] !== props[propName]) {
            shouldUpdateStyles = true;
          }
        });
      }

      if (shouldUpdateStyles) {
        this.shouldUpdateDOM = true;
        subscription.orgProps = props;
        subscription.props = createPropsObject(props);
        new StyleParser(subscription).run();
        if (typeof subscription.onUpdate === 'function') {
          subscription.onUpdate();
        }
      }
    }
  }
  unsubscribe({ ref }) {
    const index = this.subscriptions.findIndex(s => s.ref === ref);
    if (index > -1) {
      this.subscriptions.splice(index, 1);
      window.styleHandler.updateSubscriptions(this.subscriptions);
      this.shouldUpdateDOM = true;
    }
  }
  _getPrintedStyles() {
    return this.subscriptions
      .map(s => s.printedCss)
      .filter(s => !!s)
      .join('');
  }
  toString = () => {
    this.checkIfDomNeedsUpdate(true);
    return toString() + '\r\n' + this.domHandler.toString();
  };
  toComponents = () => {
    this.checkIfDomNeedsUpdate(true);
    return [toComponent(), this.domHandler.toComponent()].filter(v => !!v);
  };
  checkIfDomNeedsUpdate(force) {
    if (this.shouldUpdateDOM || force) {
      // Update DOM!
      // const css = this._getPrintedStyles();
      // this.domHandler.update(css);
      this.shouldUpdateDOM = false;
    }
  }
}

const defaultSwissController = new SwissController();

export { defaultSwissController };

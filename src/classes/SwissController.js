import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import { toString, toComponent } from '../features/global-styles';

export default class SwissController {
  constructor(isDefault) {
    this.refCounter = 0;
    this.subscriptions = [];
    this.shouldUpdateDOM = false;
    this.domHandler = new DomHandler('newglobal');
    this.domHandler.add();
  }
  subscribe(props) {
    const subscription = {
      ref: this.refCounter,
      className: `.${props.__swissOptions.className || 'sw'}-${this.refCounter}`,
      options: props.__swissOptions,
      props,
    };
    this.refCounter++;
    this.subscriptions.push(subscription);
    new StyleParser(subscription).run();
    this.shouldUpdateDOM = true;
    return subscription;
  }
  update(subscription, props, oldProps) {
    if(subscription) {
      this.shouldUpdateDOM = true;
      subscription.props = props;
      new StyleParser(subscription).run();
    }
  }
  unsubscribe({ ref }) {
    const index = this.subscriptions.findIndex(s => s.ref === ref);
    if(index > -1) {
      this.subscriptions.splice(index, 1);
      this.shouldUpdateDOM = true;
    }
  }
  getPropsForSubscription(subscription, excludeProps = []) {
    const options = subscription.options;

    if(Array.isArray(options.excludeProps)) {
      excludeProps = excludeProps.concat(options.excludeProps);
    }

    let includeProps = [];
    if(Array.isArray(options.includeProps)) {
      includeProps = includeProps.concat(options.includeProps);
    }
  
    const elementProps = {};
    const touchedProps = subscription.touchedProps || {};

    Object.entries(subscription.props).forEach(([propName, propValue]) => {
      if(includeProps.indexOf(propName) > -1 || 
        (!touchedProps[propName] && excludeProps.indexOf(propName) === -1)) {
        elementProps[propName] = propValue;
      }
    });

    return elementProps;
  }
  _getPrintedStyles() {
    return this.subscriptions.map(s => s.printedCss).filter(s => !!s).join('');
  }
  toString() {
    this.checkIfDomNeedsUpdate(true);
    return toString() + '\r\n' + this.domHandler.toString();
  }
  toComponents() {
    this.checkIfDomNeedsUpdate(true);
    return [toComponent(), this.domHandler.toComponent()].filter(v => !!v);
  }
  checkIfDomNeedsUpdate(force) {
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
import StyleParser from './StyleParser';
import DomHandler from './DomHandler';
import { toString, toComponent } from '../features/global-styles';
import createPropsObject from '../helpers/createPropsObject';

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
      className: `.${props.__swissOptions.className || 'swiss'}-${this.refCounter}`,
      options: props.__swissOptions,
      orgProps: props,
      props: createPropsObject(props),
    };
    this.refCounter++;
    this.subscriptions.push(subscription);
    new StyleParser(subscription).run();
    this.shouldUpdateDOM = true;
    return subscription;
  }
  update(subscription, props) {
    if(subscription) {
      let shouldUpdateStyles = true;
      if(subscription.options.pure) {
        shouldUpdateStyles = false;
        subscription.options.pure.forEach((propName) => {
          if(subscription.props[propName] !== props[propName]) {
            shouldUpdateStyles = true;
          }
        })
      }

      if(shouldUpdateStyles) {
        this.shouldUpdateDOM = true;
        subscription.orgProps = props;
        subscription.props = createPropsObject(props);
        new StyleParser(subscription).run();
      }
      
    }
  }
  unsubscribe({ ref }) {
    const index = this.subscriptions.findIndex(s => s.ref === ref);
    if(index > -1) {
      this.subscriptions.splice(index, 1);
      this.shouldUpdateDOM = true;
    }
  }
  filterPropsForSubscription(subscription, props, dontForwardProps = []) {
    const options = subscription.options;

    if(Array.isArray(options.dontForwardProps)) {
      dontForwardProps = dontForwardProps.concat(options.dontForwardProps);
    }
    const touched = subscription.props.__swissDontForwardProps;
    dontForwardProps = dontForwardProps.concat(Object.keys(touched));
    if(options.touchedProps) {
      dontForwardProps = dontForwardProps.concat(Object.keys(options.touchedProps));
    }
    let forwardProps = [];
    if(Array.isArray(options.forwardProps)) {
      forwardProps = forwardProps.concat(options.forwardProps);
    }
  
    const elementProps = {};

    Object.entries(props).forEach(([propName, propValue]) => {
      if(forwardProps.indexOf(propName) > -1 || dontForwardProps.indexOf(propName) === -1) {
        elementProps[propName] = propValue;
      }
    });

    return elementProps;
  }
  _getPrintedStyles() {
    return this.subscriptions.map(s => s.printedCss).filter(s => !!s).join('');
  }
  toString = () => {
    this.checkIfDomNeedsUpdate(true);
    return toString() + '\r\n' + this.domHandler.toString();
  }
  toComponents = () => {
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
import React, { PureComponent } from 'react';
import SwissController from '../classes/SwissController';

class SwissServerSide extends PureComponent {
  constructor(props) {
    super(props);
    this.controller = new SwissController();
  }
  getChildContext() {
    return {
      swissController: this.controller,
    };
  }
  render() {
    if(typeof this.props.context === 'object') {
      this.props.context.toString = this.controller.toString;
      this.props.context.toComponents = this.controller.toComponents;
    }
    return this.props.children;
  }
}

SwissServerSide.childContextTypes = {
  swissController: () => null,
};

export default SwissServerSide;
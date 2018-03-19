import React, { PureComponent, Children } from 'react';
import propValidate from '../utils/propValidate';

export default class SwissProvider extends PureComponent {
  getChildContext() {
    const { controller } = this.props;

    return { swissController: controller };
  }
  render() {
    const { children } = this.props;
    return Children.only(children);
  }
}

SwissProvider.childContextTypes = {
  swissController: propValidate,
};
SwissProvider.propTypes = {
  swiss: propValidate,
};

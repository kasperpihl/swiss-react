import React, { PureComponent } from 'react';
import { object, element } from 'prop-types';

export default class SwissProvider extends PureComponent {
  getChildContext() {
    const { controller } = this.props;

    return { swissController: controller };
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

SwissProvider.childContextTypes = {
  swissController: object,
};
SwissProvider.propTypes = {
  swiss: object,
  children: element,
};

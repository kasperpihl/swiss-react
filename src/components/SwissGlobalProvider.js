import React, { PureComponent } from 'react';

class GlobalProvideProps extends PureComponent {
  getChildContext() {
    const {
      children,
      controller,
      ...rest,
    } = this.props;

    return {
      globalProvidedProps: rest,
      swissController: controller,
    };
  }
  render() {
    return this.props.children;
  }
}

GlobalProvideProps.childContextTypes = {
  globalProvidedProps: () => null,
  swissController: () => null,
};

export default GlobalProvideProps;
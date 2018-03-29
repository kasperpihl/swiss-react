import React, { PureComponent } from 'react';

class ProvideProps extends PureComponent {
  getChildContext() {
    const {
      children,
      ...rest,
    } = this.props;

    return { providedProps: rest };
  }
  render() {
    return this.props.children;
  }
}

ProvideProps.childContextTypes = {
  providedProps: () => null,
};

export default ProvideProps;
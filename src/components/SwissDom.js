import React, { PureComponent } from 'react';

export default class SwissDom extends PureComponent {
  constructor(props) {
    super(props);
  }
  renderPortal() {}
  render() {
    const { children } = this.props;
    return (
      <Fragment>
        {this.renderPortal()}
        {children}
      </Fragment>
    );
  }
}

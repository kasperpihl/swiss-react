import React, { PureComponent } from 'react';

export default class SubscriptionNode extends PureComponent {
  componentDidMount() {
    this.props.subscription.onUpdate = this.onUpdate;
  }
  onUpdate = () => {
    this.forceUpdate();
  };
  render() {
    const { subscription } = this.props;
    return subscription.printedCss || null;
  }
}

import React, { Component } from 'react';
import SubscriptionNode from './SubscriptionNode';

export default class SwissStyleHandler extends Component {
  constructor(props) {
    super(props);
    this.subscriptions = [];
  }
  updateSubscriptions = subscriptions => {
    // return;
    this.subscriptions = subscriptions;
    if (this.didRender) {
      this.forceUpdate();
      this.didRender = false;
    }
  };
  render() {
    const { subscriptions } = this;
    this.didRender = true;
    return subscriptions.map(subscription => (
      <SubscriptionNode key={subscription.ref} subscription={subscription} />
    ));
  }
}

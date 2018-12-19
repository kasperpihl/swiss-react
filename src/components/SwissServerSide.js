import React, { Component } from 'react';
import SwissController from '../classes/SwissController';
import { ServerContext } from '../helpers/contexts';

class SwissServerSide extends Component {
  render() {
    if (!this.controller) {
      this.controller = new SwissController();
    }

    const { context, children } = this.props;

    if (typeof context === 'object') {
      context.toString = this.controller.toString;
      context.toComponents = this.controller.toComponents;
    }
    return (
      <ServerContext.Provider value={this.controller}>
        {children}
      </ServerContext.Provider>
    );
  }
}

SwissServerSide.propTypes = {
  context: (props, propName) => {
    const value = props[propName];
    if (!value) {
      console.warn('SwissServerSide expects prop context');
    } else if (typeof value !== 'object') {
      console.warn('SwissServerSide prop context must be an object');
    }
    return null;
  }
};

export default SwissServerSide;

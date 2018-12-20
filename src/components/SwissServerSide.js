import React, { Component } from 'react';
import SwissController from '../classes/SwissController';
import { ServerContext } from '../helpers/contexts';

class SwissServerSide extends Component {
  toString = () =>
    [
      '<style id="swiss-styles" type="text/css">',
      this.controller.stylesToAppend.join('\r\n'),
      '</style>',
      '<script id="swiss-hydration">',
      `window.__swissHydration = ${JSON.stringify(
        this.controller.cacheByType
      )}`,
      '</script>'
    ].join('\r\n');
  toComponents = () => (
    <>
      <style id="swiss-styles" type="text/css">
        {`${this.controller.stylesToAppend.join('\r\n')}`}
      </style>
      <script id="swiss-hydration">
        {`window.__swissHydration = ${JSON.stringify(
          this.controller.cacheByType
        )};`}
      </script>
    </>
  );
  render() {
    if (!this.controller) {
      this.controller = new SwissController();
    }

    const { context, children } = this.props;

    if (typeof context === 'object') {
      context.toString = this.toString;
      context.toComponents = this.toComponents;
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

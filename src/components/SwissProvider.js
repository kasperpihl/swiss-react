import React, { Component } from 'react';
import SwissServerContext from '../context/SwissServerContext';
import SwissDefaultContext from '../context/SwissDefaultContext';
import SwissController from '../classes/SwissController';

const isRN =
  typeof navigator != 'undefined' && navigator.product == 'ReactNative';

export default class SwissProvider extends Component {
  static contextType = SwissServerContext;
  render() {
    const { children, ...rest } = this.props;
    if (!this.context && !this.defaultController) {
      this.defaultController = new SwissController();
    }

    return (
      <SwissDefaultContext.Provider
        value={{
          controller: this.context || this.defaultController,
          contextProps: {},
          options: Object.assign(
            {
              inline: !!isRN,
              defaultEl: isRN ? null : 'div',
              debug: false
            },
            rest
          )
        }}
      >
        {children}
      </SwissDefaultContext.Provider>
    );
  }
}

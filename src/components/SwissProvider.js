import React, { Component } from 'react';
import { ServerContext, DefaultContext } from '../helpers/contexts';
import SwissController from '../classes/SwissController';

const isRN =
  typeof navigator != 'undefined' && navigator.product == 'ReactNative';

export default class SwissProvider extends Component {
  static contextType = ServerContext;
  render() {
    const { children, ...rest } = this.props;
    if (!this.context && !this.defaultController) {
      this.defaultController = new SwissController(!!rest.disableHydration);
    }

    return (
      <DefaultContext.Provider
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
      </DefaultContext.Provider>
    );
  }
}

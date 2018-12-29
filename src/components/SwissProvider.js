import React, { Component } from 'react';
import { DefaultContext } from '../helpers/contexts';
import SwissController from '../classes/SwissController';

const isRN =
  typeof navigator != 'undefined' && navigator.product == 'ReactNative';

export default class SwissProvider extends Component {
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
        {`window.__swissHydration = ${JSON.stringify({
          cacheByType: this.controller.cacheByType
        })};`}
      </script>
    </>
  );
  render() {
    const { children, context, ...rest } = this.props;
    if (!this.controller) {
      this.controller = new SwissController(!!rest.disableHydration);
    }

    if (typeof context === 'object') {
      context.toString = this.toString;
      context.toComponents = this.toComponents;
    }

    return (
      <DefaultContext.Provider
        value={{
          controller: this.controller,
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

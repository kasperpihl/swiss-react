import React, { PureComponent } from 'react';
import { SwissConsumer, SwissGlobalConsumer } from './SwissProviders';
import { SwissServerSideConsumer } from './SwissServerSide';
import SwissElement from './SwissElement';

class SwissContext extends PureComponent {
  generateContextKeys(globalProvidedProps, providedProps) {
    const returnObj = {};
    if (globalProvidedProps) {
      for (let k in globalProvidedProps) {
        returnObj[k] = globalProvidedProps[k];
      }
    }
    if (providedProps) {
      for (let k in providedProps) {
        returnObj[k] = providedProps[k];
      }
    }
    return Object.keys(returnObj);
  }
  render() {
    const defaultController = this.props.__swissOptions.defaultSwissController;

    return (
      <SwissServerSideConsumer>
        {controller => (
          <SwissGlobalConsumer>
            {globalProvidedProps => (
              <SwissConsumer>
                {providedProps => (
                  <SwissElement
                    {...globalProvidedProps}
                    {...providedProps}
                    {...this.props}
                    __swissController={controller || defaultController}
                    __swissContextKeys={this.generateContextKeys(
                      globalProvidedProps,
                      providedProps
                    )}
                  />
                )}
              </SwissConsumer>
            )}
          </SwissGlobalConsumer>
        )}
      </SwissServerSideConsumer>
    );
  }
}

export default SwissContext;

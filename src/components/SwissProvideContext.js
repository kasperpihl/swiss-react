import React, { PureComponent } from 'react';
import SwissDefaultContext from '../context/SwissDefaultContext';

class SwissProvideContext extends PureComponent {
  static contextType = SwissDefaultContext;
  render() {
    const { children, ...rest } = this.props;
    return (
      <SwissDefaultContext.Provider
        value={{
          ...this.context,
          contextProps: Object.assign({}, this.context.contextProps, rest)
        }}
      >
        {children}
      </SwissDefaultContext.Provider>
    );
  }
}

export default SwissProvideContext;

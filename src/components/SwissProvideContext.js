import React, { PureComponent } from 'react';
import { DefaultContext } from '../helpers/contexts';

class SwissProvideContext extends PureComponent {
  static contextType = DefaultContext;
  render() {
    const { children, ...rest } = this.props;
    return (
      <DefaultContext.Provider
        value={{
          ...this.context,
          contextProps: Object.assign({}, this.context.contextProps, rest)
        }}
      >
        {children}
      </DefaultContext.Provider>
    );
  }
}

export default SwissProvideContext;

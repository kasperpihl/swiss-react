import React from 'react';
import { DefaultContext } from '../helpers/contexts';

export default options => {
  class SwissComponent extends React.PureComponent {
    static contextType = DefaultContext;
    componentDidMount() {
      this.context && this.context.controller.componentDidRender();
    }
    componentDidUpdate() {
      this.context && this.context.controller.componentDidRender();
    }
    render() {
      if (!this.context) {
        console.warn(
          '<SwissProvider> not found, add it to your App.js or index.js etc. for swiss to work'
        );
        return null;
      }
      const [EL, filteredProps] = this.context.controller.prepareToRender(
        this.props,
        options,
        this.context
      );

      if (!EL) {
        console.warn('swiss error: no element found. got props:', props);
        EL = () => null;
      }

      return (
        <EL ref={this.props.innerRef} {...filteredProps}>
          {this.props.children}
        </EL>
      );
    }
  }
  SwissComponent.displayName = options.type;
  return SwissComponent;
};

import React from 'react';
import { DefaultContext } from '../helpers/contexts';

class SwissElement extends React.PureComponent {
  static contextType = DefaultContext;
  componentDidMount() {
    this.context.controller.checkIfDomNeedsUpdate();
  }
  componentDidUpdate() {
    this.context.controller.checkIfDomNeedsUpdate();
  }
  render() {
    const [EL, filteredProps] = this.context.controller.prepareToRender(
      this.props,
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

export default SwissElement;

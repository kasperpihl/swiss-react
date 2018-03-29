import React from 'react';

import propValidate from '../utils/propValidate';

class SwissElement extends React.PureComponent {
  componentWillMount() {
    this.subscription = this.getController().subscribe(this.generateProps(this.props));
  }
  componentDidMount() {
    this.getController().checkIfDomNeedsUpdate();
  }
  componentWillReceiveProps(nextProps) {
    this.getController().update(this.subscription, this.generateProps(nextProps));
  }
  componentDidUpdate() {
    this.getController().checkIfDomNeedsUpdate();
  }
  componentWillUnmount() {
    this.getController().unsubscribe(this.subscription);
  }
  getController() {
    const { swissController } = this.context;
    return swissController || this.getOptions().defaultSwissController;
  }
  generateProps(props) {
    const { providedProps, globalProvidedProps } = this.context;
    return Object.assign({}, globalProvidedProps, providedProps, props);
  }
  getOptions() {
    return this.props.__swissOptions;
  }

  render() {
    const EL = this.getOptions().element;
    // React specific excludes.
    const exclude = ['className', 'innerRef', '__swissOptions'];
    const props = this.getController()
                      .filterPropsForSubscription(this.subscription, this.props, exclude);
    
    const swissProps = { className: this.subscription.className.slice(1) };
    if(this.props.className) {
      swissProps.className = `${this.props.className} ${swissProps.className}`;
    }
    if(this.getOptions().inline) {
      delete swissProps.className;
      swissProps.style = this.subscription.inlineStyles;
    }

    return (
      <EL ref={this.props.innerRef} {...props} {...swissProps}>
        {this.props.children}
      </EL>
    );
  }
}

SwissElement.contextTypes = {
  swissController: propValidate,
  providedProps: () => null,
  globalProvidedProps: () => null,
};

export default SwissElement;  
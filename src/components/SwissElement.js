import React from 'react';

class SwissElement extends React.PureComponent {
  constructor(props) {
    super(props);
    this.subscription = this.getController().subscribe(this.props);
  }
  componentDidMount() {
    this.getController().checkIfDomNeedsUpdate();
  }
  componentWillReceiveProps(nextProps) {
    this.getController().update(this.subscription, nextProps);
  }
  componentDidUpdate() {
    this.getController().checkIfDomNeedsUpdate();
  }
  componentWillUnmount() {
    this.getController().unsubscribe(this.subscription);
  }
  getController() {
    return this.props.__swissController;
  }
  getOptions() {
    return this.props.__swissOptions;
  }

  generateSwissProps() {
    const swissProps = {
      className: this.subscription.className.slice(1),
    };

    if(this.props.className) {
      swissProps.className = `${this.props.className} ${swissProps.className}`;
    }
    
    if(this.getOptions().inline) {
      delete swissProps.className;
      swissProps.style = this.subscription.inlineStyles;
    }

    return swissProps;
  }

  render() {
    const EL = this.getOptions().element;
    // React specific excludes.
    const exclude = ['className', 'innerRef', '__swissOptions', '__swissController', '__swissContextKeys', ...this.props.__swissContextKeys];

    const props = this.getController()
                      .filterPropsForSubscription(this.subscription, this.props, exclude);
    
    const swissProps = this.generateSwissProps();

    return (
      <EL ref={this.props.innerRef} {...props} {...swissProps}>
        {this.props.children}
      </EL>
    );
  }
}

export default SwissElement;  
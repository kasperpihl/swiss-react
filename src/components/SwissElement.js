import React from 'react';

import ChangeUpdater from './ChangeUpdater';
import getDeep from '../utils/getDeep';
import arrayAddUnique from '../utils/arrayAddUnique';
import propValidate from '../utils/propValidate';

class SwissElement extends React.PureComponent {
  componentWillMount() {
    this.onRunUpdate = this.onRunUpdate.bind(this);

    const swissController = this.getSwissController();
    this.subscription = swissController.subscribe(this.props);

  }
  componentWillReceiveProps(nextProps) {
    const swissController = this.getSwissController();
    swissController.update(this.subscription.ref, nextProps, this.props);
  }
  componentWillUnmount() {
    const swissController = this.getSwissController();
    swissController.unsubscribe(this.subscription.ref);
  }
  onRunUpdate() {
    const swissController = this.getSwissController();
    swissController.updateDom();
  }
  getSwissController() {
    const { swissController } = this.context;
    return swissController || this.props.__swissOptions.defaultSwissController;
  }
  getOptions() {
    return this.props.__swissOptions;
  }
  getElement() {
    return this.props.__swissOptions.element;
  }
  getGeneratedClassName() {
    let className = `sw-${this.subscription.ref}`;
    if(this.props.className) {
      className = `${this.props.className} ${className}`;
    }

    const allProps = getDeep(this, 'subscription.parsedStyles.allProps') || [];
    
    allProps.forEach((propName) => {
      if(propName.startsWith('!') && !this.props[propName.slice(1)]) {
        className += ` sw-not-${propName.slice(1)}`;
      } else if(!propName.startsWith('!') && this.props[propName]) {
        className += ` sw-${propName}`;
      }
    });

    return className;
  }
  getPropsForElement() {
    const options = this.getOptions();

    let excludeProps = ['className', 'innerRef', '__swissOptions'];
    if(Array.isArray(options.excludeProps)) {
      excludeProps = excludeProps.concat(options.excludeProps);
    }

    let includeProps = [];
    if(Array.isArray(options.includeProps)) {
      includeProps = includeProps.concat(options.includeProps);
    }
  
    const elementProps = {};
    const touchedProps = getDeep(this, 'subscription.touchedProps') || {};

    Object.entries(this.props).forEach(([propName, propValue]) => {
      if(includeProps.indexOf(propName) > -1 || 
        (!touchedProps[propName] && excludeProps.indexOf(propName) === -1)) {
        elementProps[propName] = propValue;
      }
    });

    return elementProps;
  }

  renderInline() {
    const EL = this.getElement();
    const props = this.getPropsForElement();

    return (
      <EL style={this.subscription.inlineStyles} ref={this.props.innerRef} {...props}>
        {this.props.children}
      </EL>
    );
  }
  renderWithClassName() {
    const EL = this.getElement();
    const props = this.getPropsForElement();
    const className = this.getGeneratedClassName();

    let element = [ 
      <ChangeUpdater key="updater" runUpdate={this.onRunUpdate} />,
      <EL key="element" ref={this.props.innerRef} className={className} {...props}>
        {this.props.children}
      </EL>
    ];

    if(parseInt(React.version, 10) < 16) {
      element = (
        <EL ref={this.props.innerRef} className={className} {...props}>
          <ChangeUpdater runUpdate={this.onRunUpdate} />
          {this.props.children}
        </EL>
      );
      
    }

    return element;
  }

  render() {
    const options = this.getOptions();
    if(options.inline) {
      return this.renderInline();
    }
    return this.renderWithClassName();    
  }
}

SwissElement.contextTypes = {
  swissController: propValidate,
};

export default SwissElement;
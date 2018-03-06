import React from 'react';
import PropTypes from 'prop-types';

import ChangeUpdater from './ChangeUpdater';
import getDeep from '../utils/getDeep';
import arrayAddUnique from '../utils/arrayAddUnique';


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
  renderInline(EL, props) {
    
  }
  renderWithClassName() {

  }
  render() {
    const swissController = this.getSwissController();
    const options = this.props.__swissOptions;
    const EL = options.element;
    
    let computedClassName = `sw-${this.subscription.ref}`;
    if(this.props.className) {
      computedClassName = `${this.props.className} ${computedClassName}`;
    }

    
    let excludePropsToChild = ['className', 'sw', 'innerRef', '__swissOptions'];

    if(Array.isArray(options.excludeProps)) {
      excludePropsToChild = excludePropsToChild.concat(options.excludeProps);
    }

    const elementProps = {};
    const allProps = getDeep(this, 'subscription.parsedStyles.allProps') || [];
    Object.entries(this.props).forEach(([propName, propValue]) => {
      if(allProps.indexOf(propName) > -1) {
        computedClassName += ` sw-${this.subscription.ref}-${propName}`;
      } else if(excludePropsToChild.indexOf(propName) === -1) {
        elementProps[propName] = propValue;
      }
    })

    if(options.inline) {
      const style = swissController.getInlineStyles(this.subscription.ref);
      return (
        <EL style={style} ref={this.props.innerRef} {...elementProps}>
          {this.props.children}
        </EL>
      );
    }

    let element = [ 
      <ChangeUpdater key="updater" runUpdate={this.onRunUpdate} />,
      <EL key="element" ref={this.props.innerRef} className={computedClassName} {...elementProps}>
        {this.props.children}
      </EL>
    ];

    if(parseInt(React.version, 10) < 16) {
      element = (
        <EL ref={this.props.innerRef} className={computedClassName} {...elementProps}>
          <ChangeUpdater runUpdate={this.onRunUpdate} />
          {this.props.children}
        </EL>
      );
      
    }

    if(typeof options.render === 'function') {
      return options.render(element, this.props);
    }
    return element;
  }
}

SwissElement.contextTypes = {
  swissController: PropTypes.object,
};

export default SwissElement;
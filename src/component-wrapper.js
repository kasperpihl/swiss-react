import React from 'react';
import isSwissElement from './utils/isSwissElement';
import PropTypes from 'prop-types';
import randomString from './utils/randomString';
import arrayAddUnique from './utils/arrayAddUnique';

export default function componentWrapper(options, defaultSwissController) {
  const uniqueString = randomString(8);
  const EL = options.element;
  defaultSwissController.addStylesForUniqueId(uniqueString, options);

  class StyledElement extends React.PureComponent {
    componentWillMount() {
      this.expansions = this.props.expand || [];
      if(!Array.isArray(this.expansions)) {
        this.expansions = [ this.expansions ];
      }

      const swissController = this.getSwissController();
      this.swissId = swissController.getSwissId(uniqueString);
      this.iterateHandlers(h => h.subscribe(this.swissId, this.props));
    }
    componentWillUnmount() {
      this.iterateHandlers(h => h.unsubscribe(this.swissId, this.props));
    }
    componentWillReceiveProps(nextProps) {
      this.iterateHandlers(h => h.update(this.swissId, nextProps, this.props));
    }
    getSwissController() {
      const { swissController } = this.context;
      return swissController || defaultSwissController;
    }
    iterateHandlers(iterator) {
      const swissController = this.getSwissController();

      iterator(swissController.getStyleHandler(uniqueString));
      this.expansions.forEach((exClass) => {
        if(isSwissElement(exClass)) {
          iterator(swissController.getStyleHandler(exClass.swissUniqueString));
        }
      })
    }
    render() {
      let computedClassName = this.swissId;
      if(this.props.className) {
        computedClassName = `${this.props.className} ${computedClassName}`;
      }

      const excludePropsToChild = ['className', 'swiss', 'expand'];

      this.iterateHandlers((handler) => {
        const dClassName = handler.getClassName();
        computedClassName += ` ${dClassName}`;

        const handledProps = handler.getHandledProps();
        Object.entries(this.props).forEach(([propName, propValue]) => {
          if(handledProps.indexOf(propName) > -1) {
            arrayAddUnique(excludePropsToChild, propName);
            if(this.props[propName]) {
              computedClassName += ` ${dClassName}-${propName}`;
            }
          }
        })
      })

      const newProps = {};
      Object.entries(this.props).forEach(([propName, propValue]) => {
        if(excludePropsToChild.indexOf(propName) === -1) {
          newProps[propName] = propValue;
        }
      })

      return <EL ref="node" id={this.swissId} className={computedClassName} {...newProps}>{this.props.children}</EL>;
    }
  }
  StyledElement.contextTypes = {
    swissController: PropTypes.object,
  };
  StyledElement.swissUniqueString = uniqueString;
  StyledElement.ref = `__swiss-${uniqueString}`;

  return StyledElement;
}
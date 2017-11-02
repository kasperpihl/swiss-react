import React from 'react';
import isSwissElement from './utils/isSwissElement';
import { object } from 'prop-types';
import randomString from './utils/randomString';
import arrayAddUnique from './utils/arrayAddUnique';
import { addStylesForUniqueId } from './swiss-controller';

export default function componentWrapper(EL, styles, defaultSwissController) {
  const uniqueString = randomString(8);
  addStylesForUniqueId(uniqueString, EL, styles);

  class StyledElement extends React.PureComponent {
    componentWillMount() {
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
      let { expand } = this.props;
      iterator(swissController.getStyleHandler(uniqueString));

      if(expand) {
        if(!Array.isArray(expand)) {
          expand = [ expand ];
        }
        expand.forEach((exClass) => {
          if(isSwissElement(exClass)) {
            iterator(swissController.getStyleHandler(exClass.swissUniqueString));
          }
        })
      }
    }
    render() {
      let computedClassName = `${this.swissId}`;

      const allHandledProps = ['className', 'swiss', 'expand'];

      this.iterateHandlers((handler) => {
        const dClassName = handler.getClassName();
        computedClassName += ` ${dClassName}`;

        const handledProps = handler.getHandledProps();
        Object.entries(this.props).forEach(([propName, propValue]) => {
          arrayAddUnique(allHandledProps, propName);
          if(handledProps.indexOf(propName) > -1 && this.props[propName]) {
            computedClassName += ` ${dClassName}-${propName}`;
          }
        })
      })

      const newProps = {};
      Object.entries(this.props).forEach(([propName, propValue]) => {
        if(allHandledProps.indexOf(propName) === -1) {
          newProps[propName] = propValue;
        }
      })
      
     

      return <EL id={this.swissId} className={computedClassName} {...newProps}>{this.props.children}</EL>;
    }
  }
  StyledElement.contextTypes = {
    swissController: object,
  };
  StyledElement.swissUniqueString = uniqueString;
  StyledElement.ref = `__swiss-${uniqueString}`;

  return StyledElement;
}
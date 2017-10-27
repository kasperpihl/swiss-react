import React from 'react';
import StyleHandler from './style-handler';

export default function componentWrapper(EL, styles, number) {

  const className = `${EL}-${number}`;
  const styleHandler = new StyleHandler(className, styles);
  let totalCounter = 0;

  class StyledElement extends React.PureComponent {
    componentWillMount() {
      this.swissId = `${className}-${++totalCounter}`;
      this.iterateHandlers(handler => handler.subscribe(this.swissId, this.props));
    }
    componentWillUnmount() {
      this.iterateHandlers(handler => handler.unsubscribe(this.swissId, this.props));
    }
    componentWillReceiveProps(nextProps) {
      this.iterateHandlers(handler => handler.update(this.swissId, nextProps, this.props));
    }
    iterateHandlers(iterator) {
      let { expand } = this.props;
      iterator(styleHandler);
      if(expand) {
        if(!Array.isArray(expand)) {
          expand = [ expand ];
        }
        expand.forEach((exClass) => {
          if(typeof exClass === 'function' && typeof exClass._getStyleHandler === 'function') {
            iterator(exClass._getStyleHandler());
          }
        })
      }
    }
    render() {
      let computedClassName = `${this.swissId}`;
      
      const allHandledProps = new Set(['className', 'swiss', 'expand']);

      this.iterateHandlers((handler) => {
        const dClassName = handler.getClassName();
        computedClassName += ` ${dClassName}`;

        const handledProps = handler.getHandledProps();
        Object.entries(this.props).forEach(([propName, propValue]) => {
          if(handledProps.keys[propName]) {
            computedClassName += ` ${dClassName}-${propName}`;
          }
          if(handledProps.values[propName]) {
            computedClassName += ` ${dClassName}-${propName}-${propValue}`;
          }
          if(handledProps.all.indexOf(propName) > -1) {
            allHandledProps.add(propName);
          }
        })
      })


      const newProps = {};
      Object.entries(this.props).forEach(([propName, propValue]) => {
        if(!allHandledProps.has(propName)) {
          newProps[propName] = propValue;
        }
      })
      
     

      return <EL id={this.swissId} className={computedClassName} {...newProps}>{this.props.children}</EL>;
    }
  }
  
  StyledElement.ref = `.${className}`;
  
  StyledElement._swissServerReset = () => {
    totalCounter = 0;
    styleHandler.reset();
  }

  StyledElement._getStyleHandler = () => styleHandler;

  return StyledElement;
}
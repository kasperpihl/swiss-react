import React, { PureComponent } from 'react';
import DomHandler from './dom-handler';

export default function componentWrapper(EL, styles, number) {

  const className = `sw-${number}`;
  const domHandler = new DomHandler(className, styles);

  class StyledElement extends PureComponent {
    componentWillMount() {
      this.refNum = domHandler.subscribe(this.props);
    }
    componentWillUnmount() {
      domHandler.unsubscribe(this.refNum, this.props);
    }
    componentWillReceiveProps(nextProps) {
      domHandler.update(this.refNum, nextProps, this.props);
    }
    render() {
      const { keyProps, valueProps, allProps } = domHandler.getVariables();
      let computedClassName = className;
      keyProps.forEach(vari => {
        if(this.props[vari]) {
          computedClassName += ` ${className}-${vari}`;
        }
      });
      valueProps.forEach(vari => {
        if(this.props[vari]) {
          computedClassName += ` ${className}-${vari}-${this.props[vari]}`;
        }
      });

      const newProps = {};
      Object.entries(this.props).forEach(([name, value]) => {
        if(name !== 'className' && allProps.indexOf(name) === -1) {
          newProps[name] = value;
        }
      })

      return <EL id={`${className}-${this.refNum}`} className={computedClassName} {...newProps}>{this.props.children}</EL>;
    }
  }
  
  StyledElement.ref = `.${className}`;
  
  StyledElement._swissServerReset = () => {
    domHandler.reset();
  }

  return StyledElement;
}
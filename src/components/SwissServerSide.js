import React, { PureComponent, createContext } from "react";
import SwissController from "../classes/SwissController";

const Context = createContext(null);
const SwissServerSideConsumer = Context.Consumer;
class SwissServerSide extends PureComponent {
  constructor(props) {
    super(props);
    this.controller = new SwissController();
  }
  render() {
    if (typeof this.props.context === "object") {
      this.props.context.toString = this.controller.toString;
      this.props.context.toComponents = this.controller.toComponents;
    }
    return (
      <Context.Provider value={this.controller}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

SwissServerSide.propTypes = {
  context: (props, propName) => {
    const value = props[propName];
    if (!value) {
      console.warn("SwissServerSide expects prop context");
    } else if (typeof value !== "object") {
      console.warn("SwissServerSide prop context must be an object");
    }
    return null;
  }
};

export { SwissServerSide, SwissServerSideConsumer };

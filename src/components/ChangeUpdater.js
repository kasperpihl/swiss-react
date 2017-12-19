import React, { Component } from 'react';

class ChangeUpdater extends Component {
  componentDidMount() {
    this.props.runUpdate();
  }
  componentDidUpdate() {
    this.props.runUpdate();
  }
  render() {
    return null;
  }
}

export default ChangeUpdater;
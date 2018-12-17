import React, { PureComponent } from 'react';
import SW from './App.swiss';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        didRender: true
      });
    }, 500);
  }
  render() {
    return (
      <SW.Wrapper background="green">
        <SW.Label width="200px" color="rgba(#ff4400, 0.9)">
          Hello
        </SW.Label>
      </SW.Wrapper>
    );
  }
}

export default App;

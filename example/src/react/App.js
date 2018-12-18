import React, { PureComponent } from 'react';
import SW from './App.swiss';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      width: 100
    };
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState(state => ({
        width: state.width + 1
      }));
    }, 500);
  }
  render() {
    return (
      <SW.ProvideContext background="red">
        <SW.Wrapper className="hello" background="green">
          <SW.Label width={200}>Hello</SW.Label>
          <SW.Label width={this.state.width} color="rgba(#ff4400, 0.9)">
            Hello2
          </SW.Label>
          <SW.Label width={200}>Hello3</SW.Label>
        </SW.Wrapper>
      </SW.ProvideContext>
    );
  }
}

export default App;

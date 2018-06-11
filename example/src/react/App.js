import React, { PureComponent } from 'react';
import { styleElement } from 'swiss-react';

import SW from './App.swiss';

class App extends PureComponent {
  render() {
    return (
      <SW.Wrapper>
        <SW.Label width="200px" color="rgba(#ff4400, 0.9)">Hello</SW.Label>
      </SW.Wrapper>
    );
  }
}

export default App;
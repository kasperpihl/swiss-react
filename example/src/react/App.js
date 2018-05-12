import React, { PureComponent } from 'react';
import { styleElement, setOption } from 'react-swiss';

import styles from './App.swiss';
setOption('debug', true);

const Wrapper = styleElement('div', styles.Wrapper);
const Label = styleElement('span', styles.Label);

class App extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Label width="200px" color="rgba(#ff4400, 0.9)">Hello</Label>
      </Wrapper>
    );
  }
}

export default App;
import React, { PureComponent } from 'react';
import { element, setOption } from 'react-swiss';

import sw from './app.swiss';

setOption('inline', true);

const Wrapper = element('div', sw.wrapper, 'flex')
const Label = element('span', sw.label, 'flex wrapper');

class App extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Label color="rgba(#ff4400, 0.5)">Hello</Label>
      </Wrapper>
    );
  }
}

export default App;
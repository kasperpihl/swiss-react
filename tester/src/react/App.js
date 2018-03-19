import React, { PureComponent } from 'react';
import { element, setOption, addMixin } from 'react-swiss';

import sw from './App.swiss';

// setOption('inline', true);

const Wrapper = element('div', sw.Wrapper);
const Label = element('span', sw.Label, {
  test: {
    color: 'blue',
  },
  '#{hoverClass} &': {
    color: 'green'
  },
  '@media $max600': {
    color: 'blue',
  },
});

class App extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Label test color="rgba(#ff4400, 0.9)">Hello</Label>
      </Wrapper>
    );
  }
}

export default App;
import React, { PureComponent } from 'react';
import { element, setOption, addMixin } from 'react-swiss';

import sw from './App.swiss';

setOption('inline', true);
addMixin('test', () => {
  return {
    color: 'blue',
    _size: '100%',
  }
})

const Wrapper = element('div', sw.Wrapper);
const Label = element('span', sw.Label, {
  _test: '',
});

class App extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Label color="rgba(#ff4400, 0.9)">Hello</Label>
      </Wrapper>
    );
  }
}

export default App;
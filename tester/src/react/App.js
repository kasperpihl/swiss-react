import React, { PureComponent } from 'react';
import { element, setGlobalOption } from 'react-swiss';

import sw from './app.swiss';

setGlobalOption('inline', true);

const Wrapper = element('div', sw.wrapper, 'flex')
const Label = element('span', sw.label, 'flex wrapper');

class App extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Label color="#ff4400" test test2 width={'102px'}>Hello</Label>
      </Wrapper>
    );
  }
}

export default App;
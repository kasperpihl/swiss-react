import React, { PureComponent } from 'react';
import { element, setOption, addMixin, addGlobalStyles } from 'react-swiss';

import sw from './App.swiss';

// setOption('inline', true);
addGlobalStyles({
  '@keyframes fire-diamonds': {
    '0%': {
      transform: 'translateY(25%) translateX(-50%) rotate(45deg) scale(0)',
    },
    '50%': {
      transform: 'translateY(-75%) translateX(-50%) rotate(45deg) scale(1)',
    },
    '100%': {
      transform: 'translateY(-200%) translateX(-50%) rotate(45deg) scale(0)',
    }
  },
  '@media $max600': {
    '.hello': {
      color: 'blue',
      '&:hover': {
        color: 'white',
      }
    }
  }
});
const Wrapper = element('div', sw.Wrapper);
const Label = element('span', {
  test: {
    color: 'red',
    '&:hover': {
      color: 'black',
      '#{hoverClass=.good-luck} &': {
        color: 'green',
        '@media $max600': {
          color: 'blue',
          test2: {
            color: 'yellow',
            '&': {
              '@media $max600': {
                color: 'purple',
                '#{hoverClass=.good-luck} &': {
                  background: 'blue',
                },
              }
            }
          }
        },
      },  
    }
  },
});

class App extends PureComponent {
  render() {
    return (
      <Wrapper>
        <Label test test2 color="rgba(#ff4400, 0.9)">Hello</Label>
      </Wrapper>
    );
  }
}

export default App;
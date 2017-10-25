import React, { PureComponent } from 'react';
import swiss from 'react-swiss';

const Container = swiss('div', {
  _size: '100px',
  backgroundColor: 'blue',
  animation: 'example2 .5s ease-in infinite alternate',
  '&:hover': {
    backgroundColor: '$deepBlue100',
  },
  '@keyframes example': {
    '0%': {
      transform: 'rotate(0deg)  scale(1)'
    },
    '50%': {
      transform: 'rotate(180deg) scale(.5)'
    },
    '100%': {
      transform: 'rotate(360deg)  scale(1)'
    }
  },
  '@media (max-width: 1600px)': {
    '&': {
      backgroundColor: 'purple',
    },
  },
});

const InnerView = swiss('div', {
  default: {
    width: '50px',
    height: '50px',
    background: '$deepBlue100',
    '@media (max-width: 1600px)': {
      '#{active}': {
        background: 'red',
      },
      '#{hoverRef}:hover &': {
        background: 'yellow',
      }
    },
  },
});


class SwissTester extends PureComponent {
  render() {
    return (
      <Container>
        <InnerView hoverRef={Container.ref}>Hi</InnerView>
        <InnerView hoverRef={Container.ref} active={true}>Hi</InnerView>
        <InnerView>Hi</InnerView>
      </Container>
    );
  }
}

export default SwissTester

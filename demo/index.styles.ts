import { css, condition } from 'swiss-react';

export default css('MyButton', (opt: boolean) => ({
  wrapper: (isActive: boolean) => ({
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    background: isActive ? 'red' : 'blue',
    [condition(isActive)]: {
      color: 'red'
    },
    '&:hover': {
      '@media (min-width: 1024px)': {
        background: 'green',
        '&:active': {
          '@media (max-width: 1024)': {
            background: 'blue'
          }
        },
        color: 'red'
      },
      display: 'none'
    }
  }),
  outline: {
    display: 'flex'
  }
}));

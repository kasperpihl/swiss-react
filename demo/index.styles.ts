import { createStyles, condition } from 'swiss-react';

export default createStyles('MyButton', () => ({
  wrapper: (isActive: boolean) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'center',
    background: isActive ? 'red' : 'blue',
    [condition(isActive)]: {
      color: 'red',
      justifyContent: 'center',
      alignContent: 'center'
    },
    '&:hover': {
      '@media (min-width: 1024px)': {
        background: 'green',
        '&:active': {
          '@media (max-width: 1024)': {
            background: 'blue'
          }
        }
      }
      // display: 'none'
    }
  }),
  outline: () => ({
    display: 'block'
  })
}));

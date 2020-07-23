import { createStyles, condition } from 'swiss-react';

export default createStyles('App', (isActive: boolean) => ({
  wrapper: () => ({
    display: 'flex',
    flexDirection: 'column',
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

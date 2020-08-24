import { createStyles, condition } from 'swiss-react';

export default createStyles('DemoApp', (theme: 'red' | 'blue') => ({
  Wrapper: ({ size }: { size: 'small' | 'big' }) => ({
    display: 'flex',
    height: '60px',
    width: '60%',
    background: theme,
    '@media (min-width: 501px)': {
      '&:hover': {
        [condition(size === 'small')]: {
          background: 'blue'
        }
      }
    },
    [condition(size === 'big')]: {
      height: '80px',
      width: '100%'
    }
  }),
  Item: () => ({
    display: 'flex'
  })
}));

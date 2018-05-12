import { styleSheet } from 'react-swiss';

export default styleSheet('App', {
  Wrapper: {
    _flex: 'center',
    _size: '100%',
  },
  Label: {
    _size: ['100px', '100px'],
    background: 'blue',
    color: '#{color}',
  },
});
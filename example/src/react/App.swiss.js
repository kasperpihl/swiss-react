import { styleSheet } from 'swiss-react';

export default styleSheet('App', {
  Wrapper: {
    _debug: true,
    _flex: 'center',
    _size: '100%',
    background: props => props.background || 'red'
  },
  Label: {
    _debug: true,
    _el: 'span',
    _size: ['100px', '100px'],
    color: '#{color}',
    'background=red': {
      background: 'red'
    }
  }
});

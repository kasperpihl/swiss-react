import { styleSheet } from 'swiss-react';

export default styleSheet('App', {
  Wrapper: {
    _flex: 'center',
    _size: '100%',
  },
  Label: {
    __el: 'span',
    __className: 'Wrapper',
    _size: ['100px', '100px'],
    background: 'blue',
    color: '#{color}',
  },
});
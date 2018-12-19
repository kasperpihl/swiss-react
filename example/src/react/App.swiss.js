import { styleSheet } from 'swiss-react';

export default styleSheet('App', {
  Wrapper: {
    _flex: 'center',
    _debug: true,
    _inline: true,
    _size: '100%',
    background: get => get('background') || 'red'
  },
  Label: {
    _el: 'span',
    _debug: true,
    height: '100px',
    width: get => `${get('width', 100)}px`,
    color: get => get('color'),
    'background=red': {
      background: 'red'
    }
  }
});

import { addMixin } from 'react-swiss';

addMixin('flex', (direction, horizontal, vertical) => {
  let flex = {};
  flex.display = 'flex';

  if (direction === 'center') {
    flex.justifyContent = 'center';
    flex.alignItems = 'center';
  }

  if (direction === 'row') {
    flex.flexDirection = direction

    switch (horizontal) {
      case 'left':
        flex.justifyContent = 'flex-start';
        break;
      case 'center':
        flex.justifyContent = 'center';
        break;
      case 'right':
        flex.justifyContent = 'flex-end';
        break;
      case 'between':
        flex.justifyContent = 'space-between';
        break;
      case 'around':
        flex.justifyContent = 'space-around';
        break;
    }

    switch (vertical) {
      case 'top':
        flex.alignItems = 'flex-start';
        break;
      case 'center':
        flex.alignItems = 'center';
        break;
      case 'bottom':
        flex.alignItems = 'flex-end';
        break;
      case 'stretch':
        flex.alignItems = 'stretch';
        break;
    }    
  }

  if (direction === 'column') {
    flex.flexDirection = direction
    
    switch (horizontal) {
      case 'left':
        flex.alignItems = 'flex-start';
        break;
      case 'center':
        flex.alignItems = 'center';
        break;
      case 'right':
        flex.alignItems = 'flex-end';
        break;
    } 

    switch (vertical) {
      case 'top':
        flex.justifyContent = 'flex-start';
        break;
      case 'center':
        flex.justifyContent = 'center';
        break;
      case 'bottom':
        flex.justifyContent = 'flex-end';
        break;
      case 'between':
        flex.justifyContent = 'space-between';
        break;
      case 'around':
        flex.justifyContent = 'space-around';
        break;
    }
  }

  return {...flex}
});

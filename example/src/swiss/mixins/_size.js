import { addMixin } from 'react-swiss';

addMixin('size', (props, width=null, height=null) => ({
  width: props.width || width || 'auto',
  height: props.height || height || width || 'auto',
}));

import { addMixin } from 'react-swiss';

addMixin('size', (width=null, height=null) => ({
  width: width || 'auto',
  height: height || width || 'auto',
}));

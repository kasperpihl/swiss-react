import { addMixin } from 'react-swiss';

addMixin('size', (getProp, width=null, height=null) => ({
  width: width || 'auto',
  height: height || width || 'auto',
}));

import { addMixin } from 'react-swiss';

addMixin('size', ({ width, height }, w, h) => ({
  width: width || w || 'auto',
  height: height || h || width || w || 'auto',
}));

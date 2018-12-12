import { addMixin } from 'swiss-react';

addMixin('size', (w, h) => ({
  width: w || 'auto',
  height: h || w || 'auto'
}));

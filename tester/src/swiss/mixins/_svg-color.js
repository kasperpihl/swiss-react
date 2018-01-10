import { addMixin } from 'react-swiss';

export default (fill=null, stroke=null) => ({
  fill: fill,
  stroke: stroke || fill,
});

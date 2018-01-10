export default (width=null, height=null) => ({
  width: width || 'auto',
  height: height || width || 'auto',
});

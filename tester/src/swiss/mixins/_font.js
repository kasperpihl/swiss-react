export default (fz=null, c=null, lh=null, fw=null) => ({
  fontSize: fz || 'initial',
  color: c || 'initial',
  lineHeight: isNaN(lh) ? (parseInt(lh) / parseInt(fz)) : '1',
  fontWeight: !fw && !isNaN(lh) ? lh : fw,
});

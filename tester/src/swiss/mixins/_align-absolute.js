export default (x=null, y=null) => {
  if (x === 'center') {
    return {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transfrom: 'translate(-50%, -50%)'
    }
  }
  
  return {
    position: 'absolute',
    left: x || 0,
    top: y || x || 0,
  }
}

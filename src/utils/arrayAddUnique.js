export default (array, value, immutable) => {
  if(array.indexOf(value) === -1) {
    if(immutable){ 
      return array.concat(value);
    }
    array.push(value);
  }
}
export default (string, depth) => {
  if(typeof string === 'number') {
    depth = string;
    string = '';
  }
  for (let i = depth ; i > 0 ; i--){
    string += '  ';
  }
  return string;
}
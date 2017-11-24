export default ({ key, value, operator }, cProps) => {
  let pVal = cProps[key];
  switch(operator) {
    case 'hasValue': return !!pVal;
    case '!=': return pVal !== value;
    case '>=': return parseInt(pVal, 10) >= parseInt(value, 10);
    case '<=': return parseInt(pVal, 10) <= parseInt(value, 10);
    case '<': return parseInt(pVal, 10) < parseInt(value, 10);
    case '>': return parseInt(pVal, 10) > parseInt(value, 10);
    case '=':
    default: {
      const arr = value.split('|');
      let found = false;
      pVal = '' + pVal;
      arr.forEach((innerVal) => {
        if(pVal === innerVal) {
          found = true;
        }
      })
      return found;
    }  
  }
}
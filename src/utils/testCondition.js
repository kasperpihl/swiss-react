
export default ({ key, value, operator }, cProps) => {
  let pVal = cProps[key];
  switch(operator) {
    case 'hasValue': return !!pVal;
    case 'hasNoValue': return !pVal;
    case '>=': return parseFloat(pVal, 10) >= parseFloat(value, 10);
    case '<=': return parseFloat(pVal, 10) <= parseFloat(value, 10);
    case '<': return parseFloat(pVal, 10) < parseFloat(value, 10);
    case '>': return parseFloat(pVal, 10) > parseFloat(value, 10);
    case '!=':
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
      if(operator === '!=') found = !found;
      return found;
    }  
  }
}
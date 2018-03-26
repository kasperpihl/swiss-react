export const determineCondition = (key) => {
  // later make support for multiple conditions..
  let foundCondition = false;
  const condition = {
    key,
    operator: 'hasValue'
  };
  if(key.startsWith('!')) {
    key = key.slice(1);
    condition.key = key;
    condition.operator = 'hasNoValue';
  } else {
    ['>=', '<=', '!=', '=', '>', '<'].forEach((operator) => {
      if(!foundCondition && key.indexOf(operator) > -1) {
        foundCondition = true;
        condition.operator = operator;
        condition.value = key.slice(key.indexOf(operator) + operator.length);
        condition.key = key.slice(0, key.indexOf(operator));
      }
    })
  }
  
  return condition;
};

export const testCondition = ({ key, value, operator }, cProps, touchedProps) => {
  touchedProps[key] = true;
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
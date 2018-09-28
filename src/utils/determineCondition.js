export default key => {
  // later make support for multiple conditions..
  let foundCondition = false;
  const condition = {
    key,
    operator: 'hasValue'
  };
  if (key.startsWith('!')) {
    key = key.slice(1);
    condition.key = key;
    condition.operator = 'hasNoValue';
  } else {
    ['>=', '<=', '!=', '=', '>', '<'].forEach(operator => {
      if (!foundCondition && key.indexOf(operator) > -1) {
        foundCondition = true;
        condition.operator = operator;
        condition.value = key.slice(key.indexOf(operator) + operator.length);
        condition.key = key.slice(0, key.indexOf(operator));
      }
    });
  }

  return condition;
};

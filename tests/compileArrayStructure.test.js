import convertStylesToArray from '../dist/es/helpers/convertStylesToArray';
/*


*/
const styleSheet = {
  color: 'black',
  active: {
    color: 'blue',
  },
};
const expected = [
  { 
    type: 'node',
    key: 'color',
    value: 'black',
    selectors: [ '&' ],
    condition: null,
  },
  { 
    type: 'nested',
    key: 'active',
    value: [ { 
      type: 'node',
      key: 'color',
      value: 'blue',
      selectors: [ '&' ],
      condition: null 
    } ],
    selectors: [ '&' ],
    condition: { key: 'active', operator: 'hasValue' }
  }
];

test('adds 1 + 2 to equal 3', () => {
  const value = convertStylesToArray(styleSheet, ['&']);
  console.log(value[1]);
  expect(value).toEqual(expected);
});


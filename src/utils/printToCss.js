import indentString from './indentString';

const printToCss = (printableStyles, depth = 0) => {
  let string = '';
  console.log(printableStyles);
  printableStyles.forEach(({ selector, styles, children }) => {
    
    string += `${indentString(depth)}${selector} {\r\n`;
    styles.forEach(({ key, value }) => {
      // Support prefix with [] values;
      if(!Array.isArray(value)) {
        value = [ value ];
      }
      // Here we add support for camel case.
      key = key.replace(/([A-Z])/g, g => '-' + g[0].toLowerCase());
      value.forEach((pV) => {
        string += `${indentString(depth + 1)}${key}: ${pV};\r\n`;
      });
    })

    if(children.length) { 
      string += printToCss(children, depth + 1);
    }

    string += `${indentString(depth)}}\r\n`
  });

  return string;
}

export default printToCss;
import { addPlugin } from 'react-swiss';

addPlugin('parseKeyValue', (key, value) => ([key, hexToRGBA(value)]));

const hexToRGBA = (value) => {

  const isHex = ((hex) => {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex)
  });
  
  const hexToRGB = ((hex) => {
    if (isHex(hex)) {
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

      const longHex = hex.replace(shorthandRegex, function(m, r, g, b) {
          return r + r + g + g + b + b;
      });

      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(longHex);
      
      return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
    } else {
      console.warn(`${hex} is not a valid hex value`);
      return null;
    }
  });


  const getHex = ((a, b) => {
    const possibleHex = b;
    
    if (isHex(possibleHex)) {
      return `rgba(${hexToRGB(possibleHex)}`;
    }
    
    return a;
  });

  const hasRGBA = /rgba\((#[0-9A-F]{3,6})/i;

  if (hasRGBA.test(value)) {
    const rgba = value.replace(hasRGBA, getHex);

    if (rgba) {
      return rgba;
    }
  }
  
  return value;
}
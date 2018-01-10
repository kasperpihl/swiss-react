export default (fontPath, fontName, fontType='Regular') => ({
  src: `url('${fontPath}/${fontType}/${fontName}-${fontType}.woff') format('woff')`,
});

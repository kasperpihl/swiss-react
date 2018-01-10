export default (width, responsiveWidth, screenSize) => ({
  width: '#{width=initial}',

  '@media screen and (max-width: #{screenSize})': {
    width: 'responsiveWidth',
  }
});

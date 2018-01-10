export default (minWidth, destroyWidth) => ({
  minWidth: '#{minWidth=initial}',

  '@media screen and (max-width: #{destroyWidth})': {
    minWidth: 'initial',
  }
});

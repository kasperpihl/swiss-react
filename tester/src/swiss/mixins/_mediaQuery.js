export default (size, styles) => {
  const key = `@media screen and (max-width: ${size})`;
  const res = {
    [key]: {
      ...styles
    }
  }
  return {
    [key]: {
      ...styles
    }
  }
}

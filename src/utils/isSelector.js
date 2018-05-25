export default (selectors) => {
  if(!Array.isArray(selectors)) {
    selectors = [selectors];
  }
  if(!selectors.length) return false;
  const sel = selectors[selectors.length - 1];
  if(typeof sel !== 'string') return false;
  return (sel.indexOf('&') > -1 && sel.indexOf('&&') === -1)
}
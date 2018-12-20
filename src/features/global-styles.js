import convertStylesToArray from '../helpers/convertStylesToArray';
import StyleParser from '../classes/StyleParser';

const globalStylesArray = [];

export function getGlobalStyles() {
  return globalStylesArray;
}
function addSubscription(className, selectors, value) {
  const options = {
    className,
    globals: true
  };
  if (typeof value === 'object') {
    options.styles = convertStylesToArray(value, selectors, {
      disableProps: true
    });
  } else {
    options.styles = `${className} ${value};\r\n`;
  }
  const [rawCss] = new StyleParser().run(options);
  globalStylesArray.push(rawCss);
}

function iterateStyleObject(selectors, object) {
  if (typeof object !== 'object') {
    return;
  }
  Object.entries(object).forEach(([className, value]) => {
    if (!Array.isArray(value)) {
      value = [value];
    }
    value.forEach(v => {
      // Make sure media queries work in global styles
      if (className.startsWith('@media')) {
        return iterateStyleObject([className], v);
      }
      const selector = className.startsWith('@') ? className : '&';
      let theseSels = selectors.concat([selector]);
      addSubscription(className, theseSels, v);
    });
  });
}

export function addGlobalStyles(...globalsObj) {
  if (typeof window !== 'undefined' && window.__swissHydration) {
    return;
  }
  globalsObj.forEach(gO => {
    iterateStyleObject([], gO);
  });
}

const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

/*
Goal: Fill styles array with printable rules
Format: {
  selector: '&',
  selectors: ['', ''],
  styles: {},
  conditions: {}
}
*/
export default class Parser {
  constructor() {
    this.styleArray = [];
  }

  newOptionsForKey(options, key) {
    const returnObj = {
      selectors: Array.from(options.selectors || []),
      selector: key || '&',
    };
    if(key && (key.indexOf('&') > -1)) {
      
    } else if(key) {
      returnObj.selector = '&';
      // selector is a prop!
      const newSelector = `${this.className}-${key}`;
      if(returnObj.selectors.indexOf(newSelector) === -1){
        returnObj.selectors.push(newSelector);
      }
    }

    return returnObj;
  }
  iterateStyleObject(styles, options, targetArray) {
    const mutatedStyles = Object.assign({}, styles);
    Object.keys(styles).forEach((key) => {
      // ignore mixins. we parse them later
      if(key.startsWith('_')) {
        return;
      }

      const val = mutatedStyles[key];
      if(typeof val === 'object') {
        delete mutatedStyles[key];
        if(key.startsWith('@')) {
          this.addAtSelectors(key, val, options);
        } else {
          this.addStyleObject(val, this.newOptionsForKey(options, key), targetArray);
        }
      }
    });

    return mutatedStyles;
  }

  addStyleObject(styles, options, targetArray) {
    // using target array for deeper styles (like @media, @keyframes)
    targetArray = targetArray || this.styleArray;
    const index = targetArray.length;

    styles = this.iterateStyleObject(styles, options, targetArray);
    
    if(Object.keys(styles).length) {
      options.styles = styles;
      options.selector = options.selector.replace(/&/gi, options.selectors.join(''));
      delete options.selectors;
      targetArray.splice(index, 0, options);
    }
  }

  addAtSelectors(key, styles, options) {
    const actualStyles = {
      selector: key,
      styles: [],
    };

    this.addStyleObject(styles, this.newOptionsForKey(options), actualStyles.styles);
    if(actualStyles.styles.length) {
      this.styleArray.push(actualStyles);
    }
  }

  run(styles, className) {
    this.className = className;
    this.addStyleObject(styles, {
      selector: '&',
      selectors: className && [className] || [],
    })

    return this.styleArray;
  }
}
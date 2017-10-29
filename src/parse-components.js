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
    this.allProps = [];
  }

  checkAndAddProps(options, names) {
    if(!Array.isArray(names)) {
      names = [ names ];
    }

    names.forEach((name) => {
      if(typeof name !== 'string') {
        return;
      }
      const valueProps = name.match(PROPS_REGEX) || [];
      valueProps.forEach((pK) => {
        let propName = pK.substr(2, pK.length - 3);
        if(propName.indexOf('=') > -1) {
          propName = propName.slice(0, propName.indexOf('='));
        }
        this.addProp(options, propName);
      });
    })
  }
  addProp(options, name) {
    if(!options.props) {
      options.props = [];
    }
    if(options.props.indexOf(name) === -1) {
      options.props.push(name);
    }
    if(this.allProps.indexOf(name) === -1) {
      this.allProps.push(name);
    }
  }

  newOptionsForKey(options, key) {
    const returnObj = {
      selectors: Array.from(options.selectors || []),
      selector: key,
      globals: options.globals || false,
    };

    if(key.startsWith('@')) {
      if(key.startsWith('@keyframes')) {
        return { globals: true };
      }
      returnObj.selector = '&';
    } else if(key.indexOf('&') > -1) {
      this.checkAndAddProps(returnObj, key);
    } else if(!options.globals) {
      // selector is a prop!
      returnObj.selector = '&';

      this.addProp(returnObj, key);
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
      const val = mutatedStyles[key];
      // ignore mixins. we parse them later
      this.checkAndAddProps(options, val);

      if(key.startsWith('_')) {
        return;
      }

      
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

    this.addStyleObject(styles, this.newOptionsForKey(options, key), actualStyles.styles);
    if(actualStyles.styles.length) {
      this.styleArray.push(actualStyles);
    }
  }

  run(styles, className) {
    this.className = className;
    this.addStyleObject(styles, {
      selector: '&',
      selectors: className && [className] || [],
    });

    return {
      styleArray: this.styleArray,
      allProps: this.allProps,
    };
  }
}
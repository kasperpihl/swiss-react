import { parseVariables } from '../features/variables';

const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

export default class Parser {
  checkAndAddProps(options, name) {
    
  }
  addProp(prop) {
    if(this.allProps.indexOf(prop) === -1) {
      this.allProps.push(prop);
    }
  }

  newOptionsForKey(options, key) {
    const returnObj = {
      selectors: Array.from(options.selectors || []),
      selector: key,
      globals: options.globals || false,
      conditions: options.conditions || [],
    };

    if(key.startsWith('@')) {
      if(key.startsWith('@keyframes')) {
        return { globals: true };
      }
      if(key.startsWith('@media')) {
        returnObj.selector = '&';
      }
     
    } else if(key.indexOf('&') > -1) {
      // Check for things like '#{hoverClass=.sw-global}:hover &'
      const valueProps = key.match(PROPS_REGEX) || [];
      valueProps.forEach((pK, test) => {
        let propName = pK.substr(2, pK.length - 3);
        // '#{hoverClass}:hover &' should require hoverClass prop to be added
        if(propName.indexOf('=') === -1) {
          returnObj.conditions = returnObj.conditions.concat({
            key: propName,
            operator: 'hasValue',
          });
        }
      });
    } else if(!options.globals) {
      // selector is a prop!
      returnObj.selector = '&';
      const operators = ['>=', '<=', '!=', '=', '>', '<'];
      let foundCondition = false;
      const condition = {
        key,
        operator: 'hasValue'
      };
      if(key.startsWith('!')) {
        key = key.slice(1);
        condition.key = key;
        condition.operator = 'hasNoValue';
      }
      operators.forEach((operator) => {
        if(!foundCondition && key.indexOf(operator) > -1) {
          condition.operator = operator;
          condition.value = key.slice(key.indexOf(operator) + operator.length);
          key = key.slice(0, key.indexOf(operator));
          condition.key = key;
        }
      })
      returnObj.conditions = returnObj.conditions.concat(condition);

      let newSelector = `.sw-${key}`;
      if(condition.operator === 'hasNoValue') {
        newSelector = `.sw-not-${key}`;
        this.addProp(`!${key}`);
      } else {
        this.addProp(key);
      }

      if(returnObj.selectors.indexOf(newSelector) === -1){
        returnObj.selectors.push(newSelector);
      }
    }

    return returnObj;
  }

  iterateStyleObject(styles, options, targetArray) {
    const mutatedStyles = Object.assign({}, styles);
    Object.keys(styles).forEach((key) => {
      const indexKey = key;
      key = parseVariables(key);

      let val = mutatedStyles[indexKey];

      if(key.startsWith('@import')) {
        delete mutatedStyles[indexKey];
        return this.styleArray.push({
          pureCss: `${key} ${val};`,
        })
      }

      // ignore mixins. we parse them runtime
      if(key.startsWith('_')) {
        return;
      }
      if(typeof val === 'object' && !Array.isArray(val)) {
        val = [ val ];
      }
      if(typeof val === 'object') {
        delete mutatedStyles[indexKey];
        val.forEach((innerVal) => {
          if(typeof innerVal !== 'object') {
            return console.warn('swiss: unsupported value in array. only object is supported');
          }
          if(key.startsWith('@') && !key.startsWith('@font-face')) {
            this.addAtSelectors(key, innerVal, options);
          } else {
            this.addStyleObject(innerVal, this.newOptionsForKey(options, key), targetArray);
          }
        })
        
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
    this.styleArray = [];
    this.allProps = [];
    this.className = className;
    this.addStyleObject(styles, {
      selector: '&',
      selectors: className && [className] || [],
      globals: !className
    });

    return {
      styleArray: this.styleArray,
      allProps: this.allProps,
    };
  }
}
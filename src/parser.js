const PROPS_REGEX = /#{([a-zA-Z0-9_-]*)\=?(.*?)}/gi; 

export default class Parser {
  constructor() {
    this.styleArray = [];
    this.keyframes = [];
  }

  addProps(options, names) {
    if(typeof names === 'string') {
      names = [ names ];
    }

    if(!Array.isArray(names) || typeof options !== 'object') {
      return;
    }

    names.forEach((name) => {
      if(typeof name !== 'string') {
        return;
      }
      const valueProps = name.match(PROPS_REGEX) || [];
      valueProps.forEach((pK) => {
        let value = pK.substr(2, pK.length - 3);
        if(value.indexOf('=') > -1) {
          value = value.slice(0, value.indexOf('='));
        }
        if(options.valueProps) {
          options.valueProps[value] = true;
        }
      });
    })
    
  }

  getDefaultOptions(rootStyleKey, extra) {
    return {
      rootStyleKey,
      valueProps: {},
      ...extra
    };
  }

  // ======================================================
  // Apply the styles
  // ======================================================
  addStylesToTarget(index, styleKey, styleValue, options) {
    let { attachToTarget, valueProps, rootStyleKey } = options;
    if(!attachToTarget) {
      attachToTarget = this.styleArray;
    }

    if(Array.isArray(attachToTarget)) {
      const addObject = {
        styleKey,
        styleValue,
        rootStyleKey,
        valueProps,
      };
      if(typeof index !== 'number') {
        attachToTarget.push(addObject);
      } else {
        attachToTarget.splice(index, 0, addObject);
      }
    } else if(typeof attachToTarget === 'object') {
      if(index) {
        attachToTarget[index] = styleValue;
      } else {
        attachToTarget = Object.assign(attachToTarget, styleValue);
      }
    }
  }

  traverseStyleObject(styleKey, iterateObject, options) {
    const mutatedObject = Object.assign({}, iterateObject);

    Object.entries(iterateObject).forEach(([key]) => {
      const val = mutatedObject[key];
      this.addProps(options, key);
      this.addProps(options, val);
      // ignore mixins.
      if(key.startsWith('_')) {
        return;
      }

      if(typeof val === 'object') {
        
        if(!options.keepDeep) {
          delete mutatedObject[key];
        }

        if(key.startsWith('@')) {
          if(key.startsWith('@keyframes') ) {
            this.createStyleObject(key, val, { keepDeep: true, attachToTarget: this.keyframes });
          } else if(key.startsWith('@media')){
            this.createStyleObject(key, val, Object.assign({}, options, {
              rootTarget: val
            }));
          } else {
            console.warn(`unhandled @ selector: ${key}. Value: `, val);
          }
        } else {
          if(options.keepDeep || options.rootTarget) {
            mutatedObject[key] = this.traverseStyleObject(key, val, options);
          } else {
            this.createStyleObject(key, val, options);
          }
        }
      }
    });
    return mutatedObject;
  }

  createStyleObject(styleKey, styleValue, options) {
    const indexToInsertFrom = this.styleArray.length;
    styleValue = this.traverseStyleObject(styleKey, styleValue, options);

    if(Object.keys(styleValue).length) {
      this.addStylesToTarget(indexToInsertFrom, styleKey, styleValue, options);
    }
  }

  runGlobals(globals) {
    globals.forEach((gObj) => {
      Object.entries(gObj).forEach(([key, val]) => {
        this.createStyleObject(key, val, {
          keepDeep: true
        });
      });
    });

    return this.styleArray.concat(this.keyframes);
  }

  run(styles, className) {
    Object.entries(styles).forEach(([key, val]) => {
      let rootStyleKey = `.${className}`;
      let addProp;
      if(key !== 'default') {
        if(key.indexOf('=') > -1) {
          addProp = key.slice(0, key.indexOf('='));
          key = key.replace('=', '-');
        }
        rootStyleKey = `.${className}.${className}-${key}`;
      }
      const options = this.getDefaultOptions(rootStyleKey);
      if(addProp) {
        options.valueProps[addProp] = true;
      }
      this.createStyleObject('&', val, options);
    });
    return this.styleArray.concat(this.keyframes);
  }
}
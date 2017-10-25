const VARREGEX = /#{(.*?)}/gi;
import Printer from './printer';

export default class Parser {
  constructor(className, styles) {
    this.styles = styles;
    this.className = className;

    this.keyProps = new Set();
    this.valueProps = new Set();
    this.allProps = new Set();
  }

  getPropsInfo() {
    return {
      keyProps: [...this.keyProps],
      valueProps: [...this.valueProps],
      allProps: [...this.allProps],
    };
  }

  getAllKeysFromRoot(rootTarget, styleKey) {
    const styleKeys = [];
    
    const keyVariables = styleKey.match(VARREGEX);
    if(keyVariables && keyVariables.length) {
      keyVariables.forEach(propKey => {
        const actualKey = propKey.substr(2, propKey.length - 3);
        this.valueProps.add(actualKey);
        this.allProps.add(actualKey);
      })
      Object.entries(this.props).forEach(([refNum, props]) => {
        let localStyleKey = styleKey.replace(/&/gi, `#${this.className}-${refNum}${rootTarget}`);
        keyVariables.forEach((propKey) => {
          const actualKey = propKey.substr(2, propKey.length - 3);
          let value = this.props[refNum][actualKey];
          if(this.props[refNum][actualKey]) {
            if(!value.startsWith('.')){
              value = `.${this.className}-${actualKey}-${value}`;
            }
            localStyleKey = localStyleKey.replace(new RegExp(propKey, 'g'), value);
          }
        })
        if(!localStyleKey.match(VARREGEX)) {
          styleKeys.push(localStyleKey);
        }
      })
    } else {
      styleKeys.push(styleKey.replace(/&/gi, rootTarget));
    }

    return styleKeys;
  }

  // ======================================================
  // Apply the styles
  // ======================================================
  addStylesToTarget(index, styleKey, styleValue, target) {
    if(!target) {
      target = this.styleArray;
    }
    if(Array.isArray(target)) {
      const addObject = {
        styleKey,
        styleValue,
      };
      if(typeof index !== 'number') {
        target.push(addObject);
      } else {
        target.splice(index, 0, addObject);
      }
    } else if(typeof target === 'object') {
      if(index) {
        target[index] = styleValue;
      } else {
        target = Object.assign(target, styleValue);
      }
    }

  }

  traverseStyleObject(styleKey, iterateObject, options) {
    options = options || {};
    const mutatedObject = Object.assign({}, iterateObject);

    Object.entries(iterateObject).forEach(([key]) => {
      const val = mutatedObject[key];
      if(key.startsWith('_')) {
        // Ignore mixins. We parse them in the printer.js
        return;
      }

      if(typeof val === 'string' || typeof val === 'number') {
      }

      if(typeof val === 'object') {
        if(!options.keepDeep) {
          delete mutatedObject[key];
        }
        if(key.startsWith('@')) {
          if(key.startsWith('@keyframes') ) {
            this.createStyleObject(key, val, { keepDeep: true, target: this.keyframes });
          } else if(key.startsWith('@media')){
            this.createStyleObject(key, val, Object.assign({}, options, { rootTarget: val, }));
          }
        } else {
          const allKeys = this.getAllKeysFromRoot(options.rootStyleKey, key);
          allKeys.forEach((parsedKey) => {
            if(options.keepDeep || options.rootTarget) {
              mutatedObject[parsedKey] = this.traverseStyleObject(parsedKey, val, options);
            } else {
              this.createStyleObject(parsedKey, val, options);
            }
          });
        }
      }
    });
    return mutatedObject;
  }

  createStyleObject(styleKey, styleValue, options) {
    const indexToInsertFrom = this.styleArray.length;

    styleValue = this.traverseStyleObject(styleKey, styleValue, options);

    if(Object.keys(styleValue).length) {
      this.addStylesToTarget(indexToInsertFrom, styleKey, styleValue, options && options.target);
    }
  }

  _preRun(props) {
    this.styleArray = [];
    this.keyframes = [];
    this.media = [];

    this.props = props;
  }

  _returnRun() {
    return {
      styleArray: this.styleArray.concat(this.keyframes),
      keyProps: this.keyProps,
      valueProps: this.valueProps,
    };
  }

  runGlobals(globals) {
    this._preRun();

    globals.forEach((gObj) => {
      Object.entries(gObj).forEach(([key, val]) => {
        this.createStyleObject(key, val, {
          keepDeep: true,
        });
      });
    });

    return this._returnRun();
  }

  run(props) {
    this._preRun(props);

    Object.entries(this.styles).forEach(([key, val]) => {
      let root = `.${this.className}`;
      if(key !== 'default') {
        root += `.${this.className}-${key}`;
        this.keyProps.add(key);
        this.allProps.add(key);
      }
      this.createStyleObject(root, val, {
        rootStyleKey: root,
      });
    });
    return this._returnRun();
  }
}
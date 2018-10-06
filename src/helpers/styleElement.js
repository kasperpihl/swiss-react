import React from 'react';

import { defaultSwissController } from '../classes/SwissController';
import SwissContext from '../components/SwissContext';
import { getOption } from '../features/options';
import convertStylesToArray from './convertStylesToArray';

const styleElement = (...styles) => {
  const options = {
    inline: !!getOption('inline'),
    debug: !!getOption('debug'),
    element: getOption('defaultEl')
  };
  if (styles[0] && styles[0].__isSwissElement) {
    Object.assign(options, styles[0].getOptions());
  }

  // Support for adding swiss elements and grab their styles.
  let index = 0;
  let foundClassName = '';
  do {
    const styleSheet = styles[index];

    if (typeof styleSheet === 'function' && styleSheet.__isSwissElement) {
      const dStyles = styleSheet.getStyles();
      styles.splice(index, 1, ...dStyles);
      index += dStyles.length;
    } else if (
      typeof styleSheet === 'object' &&
      styleSheet !== null &&
      !Array.isArray(styleSheet)
    ) {
      if (styleSheet.__swissStyleClassName) {
        foundClassName = styleSheet.__swissStyleClassName;
      }
      index++;
    } else {
      if (typeof styleSheet === 'string') {
        foundClassName += styleSheet;
      }
      styles.splice(index, 1);
    }
  } while (index < styles.length);

  if (foundClassName) {
    options.className = foundClassName;
  }

  options.originalStyles = styles; // save before converting
  // Keeping track of touched prop conditions.
  options.__touchedConditionalProps = {};
  options.styles = Object.entries(styles).map(entry => ({
    selectors: ['&'],
    type: 'nested',
    condition: null,
    key: '&',
    value: convertStylesToArray(
      entry[1],
      ['&'],
      {
        __touchedConditionalProps: options.__touchedConditionalProps
      },
      (k, v) => {
        options[k] = v;
      }
    )
  }));

  options.defaultSwissController = defaultSwissController;

  const render = props => {
    return <SwissContext {...props} __swissOptions={options} />;
  };
  render.displayName = foundClassName || 'SwissElement';
  render.__isSwissElement = true;
  render.getOptions = () => options;
  render.getStyles = () => styles;
  render.pure = (...keys) => {
    options.pure = keys;
    return render;
  };
  render.debug = () => {
    options.debug = true;
    return render;
  };

  return render;
};

export default styleElement;

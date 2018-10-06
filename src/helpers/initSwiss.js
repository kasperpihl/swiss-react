import React from 'react';
import SwissStyleHandler from '../components/SwissStyleHandler';
import { setOption } from '../features/options';

export default () => {
  if (typeof navigator != 'undefined' && navigator.product == 'ReactNative') {
    // React native..
  } else {
    if (typeof document !== 'undefined') {
      const render = require('react-dom').render;

      const _domEl = document.createElement('style');
      _domEl.id = 'swiss-styles';
      _domEl.type = 'text/css';
      document.head.appendChild(_domEl);
      render(
        <SwissStyleHandler
          ref={c => {
            window.styleHandler = c;
          }}
        />,
        document.getElementById('swiss-styles')
      );
    }
  }
};

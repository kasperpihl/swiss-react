import { addVariables, addMixin, addGlobals, addPlugin, addStyles } from 'react-swiss';

import reset from './reset';
import size from './mixins/_size';
import widthSpecifications from './mixins/_widthSpecifications';
import alignAbsolute from './mixins/_align-absolute';
import font from './mixins/_font';
import fontFace from './mixins/_font-face';
import flex from './mixins/_flex';
import svgColor from './mixins/_svg-color';
import mediaQuery from './mixins/_mediaQuery';
import truncateString from './mixins/_truncate-string';
import inlineResponsiveMinWidth from './mixins/_inline-responsive-min-width';
import inlineResponsiveWidth from './mixins/_inline-responsive-width';
import colors from './variables/colors';
import screenSize from './variables/screen-size';
import stylis from 'stylis';
import hexToRGBA from './plugins/hexToRGB'

addVariables(colors, screenSize);

// addPlugin('parseRawCss', rawCss => stylis('', rawCss));
addPlugin('parseKeyValue', keyValue => {
  return {
    key: keyValue.key,
    value: hexToRGBA(keyValue.value),
  }
});

addStyles('green', {
  background: 'green',
  blue: {
    background: 'blue',
  }
})

addStyles('ml', {
  marginLeft: '#{val=100px}'
})

addStyles('flex', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'initial',
  'wrap': {
    flexWrap: 'wrap',
  },
  'center': {
    justifyContent: 'center',
    alignItems: 'center',
  },
  'horizontal=left': {
    justifyContent: 'flex-start',
  },
  'horizontal=center': {
    justifyContent: 'center',
  },
  'horizontal=right': {
    justifyContent: 'flex-end',
  },
  'horizontal=between': {
    justifyContent: 'space-between',
  },
  'horizontal=around': {
    justifyContent: 'space-around',
  },
  'vertical=top': {
    alignItems: 'flex-start',
  },
  'vertical=center': {
    alignItems: 'center',
  },
  'vertical=bottom': {
    alignItems: 'flex-end',
  },
  'vertical=stretch': {
    alignItems: 'stretch',
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'initial',
    'center': {
      justifyContent: 'center',
      alignItems: 'center',
    },
    'horizontal=left': {
      alignItems: 'flex-start',
    },
    'horizontal=center': {
      alignItems: 'center',
    },
    'horizontal=right': {
      alignItems: 'flex-end',
    },
    'vertical=top': {
      justifyContent: 'flex-start',
    },
    'vertical=center': {
      justifyContent: 'center',
    },
    'vertical=bottom': {
      justifyContent: 'flex-end',
    },
    'vertical=between': {
      justifyContent: 'space-between',
    },
    'vertical=around': {
      justifyContent: 'space-around',
    },
  }
})

addMixin('size', size);
addMixin('widthSpecifications', widthSpecifications);
addMixin('alignAbsolute', alignAbsolute);
addMixin('font', font);
addMixin('fontFace', fontFace);
addMixin('flex', flex);
addMixin('svgColor', svgColor);
addMixin('truncateString', truncateString);
addMixin('mediaQuery', mediaQuery);
addMixin('inlineResponsiveMinWidth', inlineResponsiveMinWidth);
addMixin('inlineResponsiveWidth', inlineResponsiveWidth);

addGlobals(reset);

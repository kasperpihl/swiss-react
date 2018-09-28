import formatTime from '../utils/formatTime';
import filterPropsForSubscription from '../utils/filterPropsForSubscription';

export const logSubscription = (sub, startTime) => {
  if (
    typeof console !== 'undefined' &&
    typeof console.groupCollapsed !== 'undefined'
  ) {
    const duration = new Date().getTime() - startTime.getTime();
    const parts = [];

    const title = [
      sub.options.globals ? 'GLOBALS' : 'ELEMENT',
      `%c${sub.className}`,
      `%c@ ${formatTime(startTime)}`,
      `%c(in ${duration.toFixed(2)} ms)`
    ].join(' ');
    const styles = [
      'color: gray; font-weight: lighter;',
      '',
      'color: gray; font-weight: lighter;',
      'color: gray; font-weight: lighter;'
    ];

    console.groupCollapsed(`%c ${title}`, ...styles);

    if (sub.options.originalStyles && sub.options.originalStyles.length) {
      console.groupCollapsed(
        `%c swiss stylesheet`,
        `color: blue; font-weight: bold`
      );
      sub.options.originalStyles.forEach(s => {
        console.log(s);
        console.log('');
        console.log(JSON.stringify(s, null, 2));
      });
      console.groupEnd();
    }

    if (sub.props) {
      sub.props.__swissDisableTouch = true;
      const filteredProps = {};
      let hasProps = false;

      Object.entries(sub.props).forEach(([k, v]) => {
        if (k.startsWith('__swiss')) return;
        filteredProps[k] = v;
        hasProps = true;
      });
      if (hasProps) {
        console.log(
          '%c component received props',
          `color: blue; font-weight: bold`,
          filteredProps
        );
        console.log(
          '%c swiss handled props (not forwarded)',
          `color: blue; font-weight: bold`,
          (sub.__swissIgnoredProps || ['none']).join(', ')
        );
        console.log(
          '%c forwarded props to inner element',
          `color: blue; font-weight: bold`,
          (sub.__swissForwardedProps || ['none']).join(', ')
        );
      }
      sub.props.__swissDisableTouch = false;
    }

    if (sub.options.inline) {
      console.groupCollapsed(
        `%c applied inline styles`,
        `color: blue; font-weight: bold`
      );
      console.log(sub.inlineStyles);
      console.log('');
      console.log(`style = ${JSON.stringify(sub.inlineStyles, null, 2)}`);
    } else {
      console.groupCollapsed(
        `%c applied css`,
        `color: blue; font-weight: bold`
      );
      console.log(sub.printedCss);
    }

    console.groupEnd();
    console.groupEnd();
  }
};

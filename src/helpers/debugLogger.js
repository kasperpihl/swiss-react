export default ({
  cacheHit,
  renderCycles,
  props,
  context,
  startTime,
  endTime,
  filteredProps,
  cache,
  // If we added any css it will be the last element
  generatedCss
}) => {
  if (
    typeof console !== 'undefined' &&
    typeof console.groupCollapsed !== 'undefined'
  ) {
    const { keyValues, passedOnProps } = cache;
    const duration = endTime.getTime() - startTime.getTime();

    const title = [
      `${renderCycles}`,
      `%c${props.__swissOptions.type}`,
      `%c${cacheHit ? 'REUSED' : 'CREATED'}`,
      `%c${duration}ms`
    ];
    const styles = [
      'color: gray; font-weight: lighter;',
      '',
      cacheHit ? 'color: green;' : 'color: red;',
      duration > 1 ? '' : 'color: gray; font-weight: lighter;'
    ];
    if (passedOnProps.className) {
      title.push(`%c.${passedOnProps.className.split(' ')[1]}`);
      styles.push('color: gray; font-weight: lighter;');
    }
    if (passedOnProps.style) {
      title.push(`%cinline`);
      styles.push('color: gray; font-weight: lighter;');
    }

    console.groupCollapsed(`%c ${title.join(' ')}`, ...styles);

    console.groupCollapsed(
      '%c> started component render()',
      'color:black; font-weight: normal;'
    );
    console.log('with these options');
    const options = Object.assign({}, context.options, props.__swissOptions);
    delete options.styles;
    delete options.originalStyles;
    console.log(options);
    console.groupEnd();

    console.groupCollapsed(
      '%c> asking for styles with props prepareToRender()',
      'color:black; font-weight: normal;'
    );
    console.log('%ccomponent props', 'color: black; font-weight: bold;');
    console.log(props);
    console.log(
      'and %ccontext props <SW.ProvideContext ...>',
      'color: black; font-weight: bold;'
    );
    console.log(context.contextProps);
    console.groupEnd();

    if (cacheHit) {
      console.groupCollapsed(
        '> %cREUSED%c styles from the cache',
        'color: green; font-weight: bold;',
        'color: black; font-weight: normal;'
      );
      console.log('found the cached row with this prop combination');
      console.log(JSON.stringify(keyValues, null, 2));
      console.groupEnd();
    } else {
      console.groupCollapsed(
        `%c> %cCREATED%c new styles in %c${duration}ms`,
        'font-weight: normal; color: black',
        'color: red; font-weight: bold;',
        'font-weight: normal; color: black',
        `color: black; font-weight: bold;`
      );
      console.log(
        '%ccreated a cache row%c with this prop combination',
        `color: black; font-weight: bold;`,
        'font-weight: normal; color: black'
      );
      console.log(JSON.stringify(keyValues, null, 2));
      console.log('\n');
      console.log(
        `and created ${
          generatedCss
            ? `className %c(${passedOnProps.className}) and css:`
            : '%cinline styles:'
        }`,
        'color: black; font-weight: bold;'
      );
      console.log(
        generatedCss
          ? generatedCss
          : JSON.stringify(passedOnProps.style, null, 2)
      );
      console.groupEnd();
    }

    console.groupCollapsed(
      '%c> component render() with props',
      'color: black; font-weight: normal;'
    );
    console.log('%cfrom swiss:', 'color: black; font-weight: bold;');
    console.log(`${JSON.stringify(passedOnProps, null, 2)}`);
    console.log('\n');
    console.log(
      'and %cpassed on from parent',
      'color: black; font-weight: bold;'
    );
    console.log(filteredProps);
    console.groupEnd();
    console.groupEnd();
  }
};

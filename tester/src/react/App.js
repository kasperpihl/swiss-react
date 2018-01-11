import React, { PureComponent } from 'react';
import { H1, H2, Div, Span } from 'react-swiss';

Span.addStyles('green');

const styles = {
  container: {
    height: '100px',
  },
  span: {
    color: 'black',
    '.spanHover:hover &': {
      color: 'red',
    },
    '&:hover': {
      color: 'blue'
    },
  },
}

class App extends PureComponent {
  render() {
    return (
      <Div
        sw={[styles.container, "flex"]}
        className="spanHover"
      >
        <Span sw={styles.span}>Hello</Span>
      </Div>
    );
  }
}

export default App;
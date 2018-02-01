import React, { PureComponent } from 'react';
import { H1, H2, Div, Span, addStyles } from 'react-swiss';

addStyles('bg', {
  background: '#{val}',
});

addStyles('ml', {
  marginLeft: '#{val=0px}',
});

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
      <Div sw="bg">
        <Span sw={styles.span}>Hello</Span>
      </Div>
    );
  }
}

export default App;
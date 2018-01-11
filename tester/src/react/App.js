import React, { PureComponent } from 'react';
import Test from '../test';
import { H1, H2, Div, Span } from 'react-swiss';

const styles = {
  container: {
    height: '100px',
  },
  span: {
    color: 'white',
  }
}

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: 'hi',
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.setState({text: 'hi2'});
    }, 100);
  }
  render() {
    return (
      <Div
        sw={[styles.container, 'flex']}
        className="spanHover"
      >
        <Span sw={styles.span}>Hello</Span>
      </Div>
    );
  }
}

export default App;
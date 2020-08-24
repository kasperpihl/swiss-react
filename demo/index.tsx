import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import DemoAppStyles from './index.styles';
import { StyleProvider, useClassNames } from 'swiss-react';

function App() {
  const [size, setSize] = useState<'big' | 'small'>('small');
  useEffect(() => {
    setTimeout(() => {
      setSize('big');
    }, 3000);
    setTimeout(() => {
      setSize('small');
    }, 6000);
  }, []);
  const c = useClassNames(DemoAppStyles, 'red');

  return <div className={c.Wrapper({ size })}></div>;
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <StyleProvider>
    <App />
  </StyleProvider>,
  rootElement
);

import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.styles';
import { StyleProvider, useClassNames } from 'swiss-react';

function SecondApp() {
  const c = useClassNames(styles);

  return <div className={c.wrapper(false)}>Hi there2</div>;
}

function App() {
  const [isActive, setIsActive] = useState(false);

  const c = useClassNames(styles);

  return (
    <div className={c.wrapper(true)}>
      <SecondApp />
      <SecondApp />
      <SecondApp />
      <SecondApp />
      <SecondApp />
    </div>
  );
}

const rootElement = document.getElementById('root');
ReactDOM.render(
  <StyleProvider>
    <App />
  </StyleProvider>,
  rootElement
);

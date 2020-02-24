import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.styles';
import { useStylesheet, StyleProvider } from 'swiss-react';
import {} from 'src/StyleProvider';

function SecondApp() {
  const s = useStylesheet(styles, false);

  return <div className={s.wrapper(true)}>Hi there2</div>;
}

function App() {
  const [isActive, setIsActive] = useState(false);

  const s = useStylesheet(styles, true);

  return (
    <div className={s.wrapper(false)}>
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

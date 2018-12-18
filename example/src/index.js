import React from 'react';
import { render } from 'react-dom';
import { SwissProvider } from 'swiss-react';
import './swiss/init';

import App from './react/App';

render(
  <SwissProvider defaultEl="div">
    <App />
  </SwissProvider>,
  document.getElementById('content')
);

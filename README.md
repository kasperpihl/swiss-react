# react-swiss

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-swiss

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import { element, addGlobalStyles, addVariables, addPlugin } from 'react-swiss'

// using CommonJS modules
var element = require('react-swiss').element;
var addGlobalStyles = require('react-swiss').addGlobalStyles;
var addVariables = require('react-swiss').addVariables;
var addPlugin = require('react-swiss').addPlugin;
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-swiss/dist/umd/swiss.min.js"></script>
```

You can find the library on `window.Swiss`.

## Documentation
http://swiss-react.com/docs/getting-started

## CodePen Examples

Original: [Simple Test](https://codepen.io/kasperpihl/pen/JLwaeb?editors=0011)

Props: [Props Test](https://codepen.io/atav32/pen/qYYKXo?editors=0010)

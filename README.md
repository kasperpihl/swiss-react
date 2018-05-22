# swiss-react

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save swiss-react

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import { element, addGlobalStyles, addVariables, addPlugin } from 'swiss-react'

// using CommonJS modules
var element = require('swiss-react').element;
var addGlobalStyles = require('swiss-react').addGlobalStyles;
var addVariables = require('swiss-react').addVariables;
var addPlugin = require('swiss-react').addPlugin;
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/swiss-react/dist/umd/swiss.min.js"></script>
```

You can find the library on `window.Swiss`.

## Documentation
http://swiss-react.com/docs/getting-started

## CodePen Examples

Original: [Simple Test](https://codepen.io/kasperpihl/pen/JLwaeb?editors=0011)

Props: [Props Test](https://codepen.io/atav32/pen/qYYKXo?editors=0010)

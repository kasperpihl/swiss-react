# react-swiss

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save react-swiss

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import { element, addGlobals, addVariables, addPlugin } from 'react-swiss'

// using CommonJS modules
var element = require('react-swiss').element;
var addGlobals = require('react-swiss').addGlobals;
var addVariables = require('react-swiss').addVariables;
var addPlugin = require('react-swiss').addPlugin;
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/react-swiss/dist/umd/swiss.min.js"></script>
```

You can find the library on `window.Swiss`.


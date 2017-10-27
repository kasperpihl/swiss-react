import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import { minify } from 'uglify-es';
import pkg from './package.json';

const prod = process.env.NODE_ENV === 'production';
const config = [
  // browser-friendly UMD build
  {
    input: './src/index',
    output: {
      file: pkg.browser,
      format: 'umd',
    },
    external: [ 'react' ],
    globals: {
      react: 'React'
    },
    name: 'Swiss',
    plugins: [

      babel({
        exclude: ['node_modules/**']
      }),
      prod && replace({
        'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development'),
      }),
      resolve(), // so Rollup can find `ms`
      commonjs({
        ignoreGlobal: true,
      }),
      prod && uglify({}, minify)
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // the `targets` option which can specify `dest` and `format`)
  {
    input: 'src/index.js',
    external: [ 'react' ],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    globals: {
      react: 'React'
    },
    name: 'Swiss',
    plugins: [
      babel({
        exclude: ['node_modules/**']
      }),
      prod && replace({
        'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development'),
      }),
      resolve(),
      prod && uglify({}, minify)
    ]
  }
];

// {
//   plugins: [
//     resolve(),
//     replace({
//       'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
//     })
//   ]
// }

// if (process.env.NODE_ENV === 'production') {
//   config.plugins.push(uglify())
// }

export default config;
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs';
import { minify } from 'uglify-es';

const prod = process.env.NODE_ENV === 'production';

const config = {
  input: './src/index',
  external: [ 'react' ],
  globals: {
    react: 'React',
  },
  name: 'Swiss',
  plugins: [
    babel({
      exclude: ['node_modules/**']
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(prod ? 'production' : 'development'),
    }),
    resolve(), // so Rollup can find `ms`
    commonjs({
      ignoreGlobal: true,
    }),
    prod && uglify({}, minify)
  ]
};

export default config;
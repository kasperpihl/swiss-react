const BABEL_ENV = process.env.BABEL_ENV
const building = BABEL_ENV != undefined && BABEL_ENV !== 'cjs'

const plugins = [
  'transform-object-rest-spread',
  'transform-class-properties',
];

if (BABEL_ENV === 'umd') {
  plugins.push('external-helpers')
}

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    'dev-expression'
  )
}

module.exports = {
  presets: [
    [ 'es2015', {
      modules: building ? false : 'commonjs'
    } ],
    'react'
  ],
  plugins: plugins
}
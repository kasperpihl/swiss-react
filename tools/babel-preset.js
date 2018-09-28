const BABEL_ENV = process.env.BABEL_ENV;
const building = BABEL_ENV != undefined && BABEL_ENV !== "cjs";

const plugins = [
  "@babel/plugin-proposal-object-rest-spread",
  "@babel/plugin-proposal-class-properties"
];

if (process.env.NODE_ENV === "production") {
  plugins.push("babel-plugin-dev-expression");
}

module.exports = () => ({
  presets: [
    [
      "@babel/preset-env",
      {
        modules: building ? false : "commonjs"
      }
    ],
    "@babel/preset-react"
  ],
  plugins: plugins
});

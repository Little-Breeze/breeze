module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  "presets": [
    [
      "@babel/preset-env",
      {
        "modules": false
      }
    ],
    "@babel/preset-react"
  ],
  "plugins": [
    "react-hot-loader/babel"
  ]
}
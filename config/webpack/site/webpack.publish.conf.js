const base = require('./webpack.base.conf')
const merge = require('webpack-merge');
const path = require('path')

module.exports = merge(base, {
  mode: 'production',
  optimization: {
    minimize: false
  },
  output: {
    path: path.resolve('./', 'docs')
  }
})

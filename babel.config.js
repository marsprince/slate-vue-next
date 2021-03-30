const babelConfigure = require('@razors/build-babel')
const config = babelConfigure({
  envConfig: {
    "exclude": ['@babel/plugin-transform-regenerator']
  }
},{
  "plugins": ["@vue/babel-plugin-jsx"]
})
module.exports = config

const babelConfigure = require('@razors/build-babel')
const config = babelConfigure({},{
  "plugins": ["@vue/babel-plugin-jsx"]
})
module.exports = config

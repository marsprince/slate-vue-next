const rollupConfigure = require('@razors/build-rollup')
const VueNextJsx = require('../../packages/babel-plugin-vue-next-jsx/package.json')
const VueNextUnwrapRef = require('../../packages/babel-plugin-vue-next-unwrap-ref/package.json')

export default [
  rollupConfigure(VueNextJsx, {
    target: 'cjs'
  }),
  rollupConfigure(VueNextUnwrapRef, {
    target: 'cjs'
  })
]

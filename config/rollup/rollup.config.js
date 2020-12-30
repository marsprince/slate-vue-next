const rollupConfigure = require('@razors/build-rollup')
const SlateVueNext = require('../../packages/slate-vue-next/package.json')

export default [
  rollupConfigure(SlateVueNext, {
    target: 'cjs',
    useTypescript: true,
    useVue: true
  }),
  rollupConfigure(SlateVueNext, {
    target: 'es',
    useTypescript: true,
    useVue: true
  })
]

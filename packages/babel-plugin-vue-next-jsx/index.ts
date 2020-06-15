import jsx from "@babel/plugin-syntax-jsx";

export default () => {
  return {
    name: '@slate-vue/babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      JSXElement: {
        exit(path) {
          console.log('in');
        },
      },
    },
  }
}

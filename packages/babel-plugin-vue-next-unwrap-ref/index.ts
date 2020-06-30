const vueRefsKey = Symbol('vueRefs')

const transform = (t, name) => {
  const identifierName = t.identifier(name)
  identifierName[vueRefsKey] = true
  return t.MemberExpression(identifierName, t.identifier('value'))
}

const isTransformed = (path) => {
  return path.node[vueRefsKey]
}

const isLegalUse = (t, path) => {
  const parent = path.parent
  // remove below situations
  // object: _withctx.show
  return !t.isObjectProperty(parent)
}

export default ({types}) => {
  return {
    name: 'babel-plugin-vue-next-unwrap-ref',
    visitor: {
      Program: {
        enter(path) {
          path.hub.file[vueRefsKey] = {};
        }
      },
      Identifier: {
        exit(path) {
          const name = path.node.name
          const file = path.hub.file;
          // collect ref variables
          if(name === 'ref' && path.parentPath.isCallExpression()) {
            const declaration = path.findParent((p) => p.isVariableDeclaration());
            // 0?
            const declarationName = declaration.node.declarations[0].id.name
            file[vueRefsKey][declarationName] = true
          }
          // convert Identifier
          if(file[vueRefsKey][name] && !isTransformed(path) && isLegalUse(types, path)) {
            path.replaceWith(transform(types, name))
          }
        }
      }
    },
  }
}

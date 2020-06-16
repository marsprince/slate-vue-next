// @ts-nocheck
// https://facebook.github.io/jsx
import jsx from "@babel/plugin-syntax-jsx";
import htmlTags from 'html-tags'
import svgTags from 'svg-tags'
import template from '@babel/template'

/**
 * Transform JSXText to StringLiteral
 * @param t
 * @param path JSXText
 * @returns StringLiteral
 */
const transformJSXText = (t, path) => {
  const node = path.node
  const lines = node.value.split(/\r\n|\n|\r/)

  let lastNonEmptyLine = 0

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].match(/[^ \t]/)) {
      lastNonEmptyLine = i
    }
  }

  let str = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    const isFirstLine = i === 0
    const isLastLine = i === lines.length - 1
    const isLastNonEmptyLine = i === lastNonEmptyLine

    // replace rendered whitespace tabs with spaces
    let trimmedLine = line.replace(/\t/g, ' ')

    // trim whitespace touching a newline
    if (!isFirstLine) {
      trimmedLine = trimmedLine.replace(/^[ ]+/, '')
    }

    // trim whitespace touching an endline
    if (!isLastLine) {
      trimmedLine = trimmedLine.replace(/[ ]+$/, '')
    }

    if (trimmedLine) {
      if (!isLastNonEmptyLine) {
        trimmedLine += ' '
      }

      str += trimmedLine
    }
  }

  return str !== '' ? t.stringLiteral(str) : null
}
/**
 * Transform JSXExpressionContainer to Expression
 * @param t
 * @param path JSXExpressionContainer
 * @returns Expression
 */
const transformJSXExpressionContainer = (t, path) => path.get('expression').node
/**
 * Transform JSXSpreadChild
 * @param t
 * @param path JSXSpreadChild
 * @returns SpreadElement
 */
const transformJSXSpreadChild = (t, path) => t.spreadElement(path.get('expression').node)


/**
 * Get tag (first attribute for h) from JSXOpeningElement
 * @param t
 * @param path JSXOpeningElement
 * @returns Identifier | StringLiteral | MemberExpression
 */
const getTag = (t, path) => {
  const namePath = path.get('name')
  if (t.isJSXIdentifier(namePath)) {
    const name = namePath.get('name').node
    if (path.scope.hasBinding(name) && !htmlTags.includes(name) && !svgTags.includes(name)) {
      return t.identifier(name)
    } else {
      return t.stringLiteral(name)
    }
  }

  if (t.isJSXMemberExpression(namePath)) {
    // TODO: transformJSXMemberExpression?
    // return transformJSXMemberExpression(t, namePath)
  }

  throw new Error(`getTag: ${namePath.type} is not supported`)
}

/**
 * Get children from Array of JSX children
 * @param t
 * @param paths Array<JSXText | JSXExpressionContainer | JSXSpreadChild | JSXElement>
 * @returns Array<Expression | SpreadElement>
 */
const getChildren = (t, paths) =>
  paths
    .map(path => {
      if (path.isJSXText()) {
        return transformJSXText(t, path)
      }
      if (path.isJSXExpressionContainer()) {
        return transformJSXExpressionContainer(t, path)
      }
      if (path.isJSXSpreadChild()) {
        return transformJSXSpreadChild(t, path)
      }
      if (path.isCallExpression()) {
        return path.node
      }
      /* istanbul ignore next */
      throw new Error(`getChildren: ${path.type} is not supported`)
    })
    .filter(el => el !== null && !t.isJSXEmptyExpression(el))

// Builds JSX Fragment <></> into
// Production: h(type, arguments, children)
function transformJSXElement(t, path) {
  const tag = getTag(t, path.get('openingElement'))
  const children = getChildren(t, path.get('children'))
  const createElement = t.identifier('h');
  // TODO: attrs
  const attrs = template.expression('{}')()
  const args = [tag, attrs]
  if (children.length) {
    args.push(t.arrayExpression(children))
  }
  return t.callExpression(createElement, args)
}

// judge vue imported
function hasImportedVue(path) {
  const body = path.node.body
  for(let i=0;i<body.length;i++) {
    const p = body[i]
    if(p.type === 'ImportDeclaration' && p.source.value == 'vue') {
      return p
    }
  }
  return false
};

// inject "import {h} from 'vue'"
function inject(t, path) {
  const importedVue = hasImportedVue(path)
  if(importedVue) {
    const keys = importedVue.specifiers.filter(function (s) {
      return s.imported !== undefined;
    }).map(function (s) {
      return s.imported.name;
    });
    const addImportSpecifier = function addImportSpecifier(s) {
      if (!keys.includes(s)) {
        importedVue.specifiers.unshift(t.ImportSpecifier(t.identifier(s), t.identifier(s)));
      }
    };
    addImportSpecifier('h');
  } else {
    const vueImportDeclaration = template.ast('import {h} from "vue"')
    path.node.body.unshift(vueImportDeclaration)
  }
}

export default ({types}) => {
  return {
    name: 'babel-plugin-vue-next-jsx',
    inherits: jsx,
    visitor: {
      JSXElement: {
        exit(path) {
          path.replaceWith(transformJSXElement(types, path))
          inject(types, path.hub.file.path)
        },
      }
    },
  }
}

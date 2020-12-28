import { defineComponent, PropType } from 'vue'
import { Text, Editor, Path, Node } from 'slate'
import { VueEditor } from 'slate-vue-shared'

interface ZeroWidthStringProps {
  length?: number
  isLineBreak?: boolean
}

/**
 * Leaf strings with text in them.
 */

const TextString = defineComponent({
  props: {
    text: String as PropType<string>,
    isTrailing: Boolean as PropType<boolean>
  },
  render() {
    const { text, isTrailing = false } = this
    return (
      <span data-slate-string>
        {text}
        {isTrailing ? '\n' : null}
      </span>
    )
  }
})

/**
 * Leaf strings without text, render as zero-width strings.
 */

const ZeroWidthString = (props: ZeroWidthStringProps) => {
  const { length = 0, isLineBreak = false } = props
  return (
    <span
      data-slate-zero-width={isLineBreak ? 'n' : 'z'}
      data-slate-length={length}
    >
      {'\uFEFF'}
      {isLineBreak ? <br /> : null}
    </span>
  )
}

/**
 * Leaf content strings.
 */
const string = defineComponent({
  props: {
    leaf: {
      type: Object as PropType<Text>
    },
    editor: Object
  },
  inject: ['isLast', 'parent', 'text'],
  components: {
    TextString
  },
  data(): any {
    return {}
  },
  render() {
    const { leaf, editor, isLast, parent, text } = this
    const path = VueEditor.findPath(editor, text as Node)
    const parentPath = Path.parent(path)

    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    if (editor.isVoid(parent)) {
      return <ZeroWidthString length={Node.string(parent as Node).length} />
    }

    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    if (
      leaf.text === '' &&
      (parent as Element & Editor).children[(parent as Element & Editor).children.length - 1] === text &&
      !editor.isInline(parent) &&
      Editor.string(editor, parentPath) === ''
    ) {
      return <ZeroWidthString isLineBreak={true} />
    }

    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // node, so we render a zero-width space so that the selection can be
    // inserted next to it still.
    if (leaf.text === '') {
      return <ZeroWidthString />
    }

    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    if (isLast && leaf.text.slice(-1) === '\n') {
      return <TextString isTrailing={true} text={leaf.text} />
    }

    return <TextString text={leaf.text} />
  }
})

export default string
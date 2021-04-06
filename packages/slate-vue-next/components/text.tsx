// For slate text, A text may contains many leaves
// under text is just render logic, so provide isLast, parent ,text for children
import { Text as SlateText, Node, Editor, Element, Range } from 'slate';

import leaf from './leaf'

import {
  KEY_TO_ELEMENT,
  NODE_TO_ELEMENT,
  ELEMENT_TO_NODE, PLACEHOLDER_SYMBOL,
  VueEditor
} from 'slate-vue-shared';
import { useEditor, useRef, useEffect } from '../plugins';
import { PropType, defineComponent, provide, inject } from 'vue';

/**
 * Text.
 */

const Text = defineComponent({
  props: {
    text: {
      type: Object as PropType<SlateText>,
      required: true
    },
    isLast: Boolean,
    parent: {
      type: Object as PropType<Element>,
      required: true
    },
    decorations: {
      type: Array as PropType<Array<Range>>
    },
  },
  components: {
    leaf
  },
  setup(props) {
    const textRef = useRef(null);
    const { text, isLast, parent } = props;

    // provide and inject
    provide('text', text)
    provide('isLast', isLast)
    provide('parent', parent)
    const decorate = inject<any>('decorate')
    const placeholder = inject('placeholder')

    const editor = useEditor();
    const key = VueEditor.findKey(editor, text)
    const initRef = () => {
      useEffect(()=>{
        if (textRef.current) {
          KEY_TO_ELEMENT.set(key, textRef.current)
          NODE_TO_ELEMENT.set(text, textRef.current)
          ELEMENT_TO_NODE.set(textRef.current, text)
        } else {
          KEY_TO_ELEMENT.delete(key)
          NODE_TO_ELEMENT.delete(text)
        }
      })
    };

    initRef()

    return {
      textRef,
      decorate,
      placeholder
    }
  },
  render() {
    const { text, placeholder, textRef } = this
    let decorations: any = this.decorations;
    if(!decorations) {
      const editor = useEditor()
      const p = VueEditor.findPath(editor, text)
      if(this.decorate) {
        decorations = this.decorate([text, p])
      }

      // init placeholder
      if (
        placeholder &&
        editor.children.length === 1 &&
        Array.from(Node.texts(editor)).length === 1 &&
        Node.string(editor) === ''
      ) {
        const start = Editor.start(editor, [])
        decorations.push({
          [PLACEHOLDER_SYMBOL]: true,
          placeholder,
          anchor: start,
          focus: start,
        })
      }
    }
    const leaves = SlateText.decorations(text, decorations)
    const children = []
    for (let i = 0; i < leaves.length; i++) {
      const leaf = leaves[i];
      children.push(
        <leaf
          leaf={leaf}
        />
        )
    }
    return (
      <span data-slate-node="text" v-ref={textRef}>
        {children}
      </span>
    )
  }
})

export default Text

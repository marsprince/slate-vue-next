import string from './string'
import { PLACEHOLDER_SYMBOL, RenderLeafProps } from 'slate-vue-shared'
import { defineComponent, PropType, inject, h } from 'vue';
import { Text } from 'slate';

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = defineComponent({
  props: {
    text: {
      type: Object as PropType<Text>,
      required: true
    },
    leaf:  {
      type: Object as PropType<Text>,
      required: true
    },
  },
  components: {
    string,
  },
  setup() {
    const renderLeaf = inject('renderLeaf', DefaultLeaf)
    return {
      renderLeaf
    }
  },
  render() {
    const { renderLeaf, text, leaf} = this;
    let children =  (
      <string leaf={leaf}/>
      );
    if (leaf[PLACEHOLDER_SYMBOL]) {
      children = (
        <fragment>
          <span
            contenteditable={false}
            style={{
              pointerEvents: 'none',
              display: 'inline-block',
              verticalAlign: 'text-top',
              width: '0',
              maxWidth: '100%',
              whiteSpace: 'nowrap',
              opacity: '0.333',
            }}
          >
            {leaf.placeholder}
          </span>
          {children}
        </fragment>
      )
    }

    const attributes: {
     'data-slate-leaf': true
    } = {
     'data-slate-leaf': true,
    };
    const renderChildren = renderLeaf({
      children,
      attributes,
      leaf,
      text
    })
    return h(renderChildren)
  }
});

/**
 * The default custom leaf renderer.
 */

const DefaultLeaf = (props: RenderLeafProps) => {
  return defineComponent({
    render() {
      const { attributes, children } = props
      return <span {...attributes}>{children}</span>
    }
  })
}

export default Leaf

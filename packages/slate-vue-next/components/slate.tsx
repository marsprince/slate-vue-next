import { reactive, defineComponent } from 'vue'
import {EDITOR_TO_ON_CHANGE} from 'slate-vue-shared';
import { useEditor } from '../plugins';

export const Slate = defineComponent({
  name: 'Slate',
  props: {
    value: String
  },
  setup({ value }: any, ctx: any) {
    const editor = useEditor()

    const clearEditor = () => {
      editor.selection = null
    }

    const renderSlate = (newVal?: any) => {
      const _value = newVal || value
      editor.children = JSON.parse(_value);
      const $$data = JSON.parse(_value);
      editor._state = reactive($$data)

      clearEditor()
    }
    renderSlate(value)
    EDITOR_TO_ON_CHANGE.set(editor, () => {
      // TODO: update selected and focused
      // TODO: how to notify others component like toolbar
      ctx.emit('onChange')
    })
  },
  render(this: any) {
    return this.$slots.default()
  }
})
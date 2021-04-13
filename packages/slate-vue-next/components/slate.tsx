import { reactive, defineComponent, nextTick } from 'vue'
import {EDITOR_TO_ON_CHANGE} from 'slate-vue-shared';
import { useEditor, triggerUpdate } from '../plugins';

export const Slate = defineComponent({
  name: 'Slate',
  props: {
    value: String
  },
  emits: ['onChange'],
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

    EDITOR_TO_ON_CHANGE.set(editor, async () => {
      await nextTick()
      triggerUpdate()

      // TODO: update selected and focused
      ctx.emit('onChange')
    })
  },
  render(this: any) {
    return this.$slots.default()
  }
})
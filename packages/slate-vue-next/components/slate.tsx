import { reactive, defineComponent } from 'vue'
import {EDITOR_TO_ON_CHANGE} from 'slate-vue-shared';
import { useEditor } from '../plugins';

const renderSlate = (value: string, editor: any) => {
  editor.children = JSON.parse(value);
  const $$data = JSON.parse(value);
  editor._state = reactive($$data)
}

export const Slate = defineComponent({
  props: {
    value: String
  },
  setup({ value }: any, ctx: any) {
    const editor = useEditor()
    renderSlate(value, editor)
    // EDITOR_TO_ON_CHANGE.set(editor, () => {
    //
    // })
  },
  render(this: any) {
    return this.$slots.default()
  }
})
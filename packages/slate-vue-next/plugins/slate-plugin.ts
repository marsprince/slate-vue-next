import { createEditor } from 'slate';

const createEditorInstance = () => {
  const editor = createEditor()
  return editor
}

export const SlatePlugin = {
  install(app: any, options?: any) {
    app.mixin({
      beforeCreate() {
        // add $editor on instance not this
        const instance = this.$
        if(!instance.$editor) {
          // assume that the editor's root starts from the component which is using Slate
          if(this.$options?.components?.Slate) {
            instance.$editor = createEditorInstance()
            if(options?.editorCreated) {
              options.editorCreated.call(this, instance.$editor)
            }
          } else {
            instance.$editor = instance.parent && instance.parent.$editor
          }
        }
      }
    })
  }
}
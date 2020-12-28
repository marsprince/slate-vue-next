import { createEditor } from 'slate';
import { vRef } from './hooks';

export const createEditorInstance = () => {
  const editor = createEditor()
  return editor
}

export const SlatePlugin = {
  install(app: any, options?: any) {
    app.mixin({
      beforeCreate() {
        // add __slateConfig on root
        const instance = this.$
        if(instance.parent === null) {
          instance.__slateConfig = options
        }
      }
    })
    app.directive('ref', vRef)
  }
}
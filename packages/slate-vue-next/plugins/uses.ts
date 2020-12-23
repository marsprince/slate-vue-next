import {getCurrentInstance} from 'vue'

export const useEditor = () => {
  return (getCurrentInstance() as any).$editor
}
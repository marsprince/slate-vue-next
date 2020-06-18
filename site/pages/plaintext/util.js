import {ref, reactive} from 'vue'
const state = reactive({
  isShow: false
})

export const isShow = state.isShow

<template>
  <Icon icon="search" v-show="isShow"><div :contentEditable="contentEditable">ad</div></Icon>
</template>

<script lang="jsx">
  import Icon from '../components/icon'
  import {ref} from 'vue'

  export default {
    components: {
      Icon
    },
    setup() {
      const isShow = ref(true)
      const contentEditable = ref(false)

      const onClick = () => {
        console.log('click');
      }
      const test = {
        beforeMount(el, binding, vnode, prevVnode) {
          console.log(el, vnode);
        },
      }
      return {
        isShow,
        contentEditable
      }
    }
  }
</script>

<style scoped>

</style>

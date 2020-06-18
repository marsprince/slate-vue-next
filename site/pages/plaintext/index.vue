<script lang="jsx">
  import Icon from '../components/icon'
  import {ref} from 'vue'

  export default () => {
    const isShow = ref(false)
    const onClick = () => {
      console.log('click');
    }
    const test = {
      beforeMount(el, binding, vnode, prevVnode) {
        console.log(el, vnode);
      },
    }
    return (
      <Icon v-show={isShow} icon="search" onInit={onClick}></Icon>
    )
  }
</script>

<style scoped>

</style>

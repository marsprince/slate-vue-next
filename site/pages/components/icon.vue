<template>
    <div>
      <slot></slot>
      <span class="icon material-icons">{{icon}}</span>
      <slot name="right" :user="user"></slot>
    </div>
</template>

<script>
  import {defineComponent} from 'vue'

  export default defineComponent({
    name: 'icon',
    props: {
      icon: String
    },
    data() {
      return {
        user: {
          name: 'dd'
        }
      }
    }
  });
</script>

<style scoped lang="less">
.icon {
  font-size: 18px;
  vertical-align: text-bottom;
}
</style>

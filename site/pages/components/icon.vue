<template>
    <span class="icon material-icons">{{icon}}</span>
</template>

<script>
  import {defineComponent} from 'vue'

  export default defineComponent({
    name: 'icon',
    props: {
      icon: String
    }
  });
</script>

<style scoped lang="less">
.icon {
  font-size: 18px;
  vertical-align: text-bottom;
}
</style>

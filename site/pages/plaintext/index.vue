<script lang="jsx">
  import Icon from '../components/icon'

  export default () => {
    const obj = {
      'class': 'active'
    }
    const onClick = () => {
      console.log('click');
    }
    return (
      <Icon class={'active d'} icon="search" onInit={onClick}></Icon>
    )
  }
</script>

<style scoped>

</style>

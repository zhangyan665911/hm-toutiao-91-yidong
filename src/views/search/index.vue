<template>
  <div class="container">
    <!-- back返回上一个页面 -->
    <van-nav-bar title="搜索中心" left-arrow @click-left="$router.back()"></van-nav-bar>
  </div>
</template>

<script>
export default {
  name: 'search'
}
</script>

<style lang="less" scoped>
</style>

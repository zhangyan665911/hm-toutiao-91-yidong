<template>
  <div class="scroll-wrapper">
        <van-list
            v-model="upLoading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <!-- <van-cell
                v-for="item in list"
                :key="item"
                :title="item"
            /> -->
        </van-list>
    </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载
      finished: false// 是否完成全部加载
    }
  },
  methods: {
    onLoad () {
      // 上拉加载方法
      console.log('开始加载数据')
    }
  }
}
</script>

<style lang="less" scoped>
</style>

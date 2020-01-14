/* eslint-disable space-before-blocks */
<template>
  <div class="scroll-wrapper">
      <van-pull-refresh v-model="downLoading" @refresh="onRefresh" :success-text="refreshSuccessText">
        <van-list
            v-model="upLoading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            >
            <van-cell
                v-for="article in articles"
                :key="article"
                :title="article"
            />
        </van-list>
      </van-pull-refresh>
    </div>
</template>

<script>
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新状态
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否完成全部加载
      articles: [], // 定义一个数组来接收上拉加载的数据
      refreshSuccessText: '' //

    }
  },
  methods: {
    // van-list组件当你的组件内容距离底部超过一定长度的时候就会再调用onload
    onLoad () {
      setTimeout(() => {
        // 给数据设置一个上限，不能超过50条，如果
        if (this.articles.length < 50) {
          // 上拉加载方法
          let arr = Array.from(Array(10), (value, index) => this.articles.length + index + 1)
          this.articles.push(...arr)
          // 关闭状态
          this.upLoading = false
        } else {
          this.finished = true
        }
      }, 1000)
    },
    onRefresh () {
      // 下拉刷新
      console.log('下拉刷新')
      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => '追加' + index + 1)
        this.articles.unshift(...arr)
        this.downLoading = false
        this.refreshSuccessText = `更新了${arr.length}`
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
</style>

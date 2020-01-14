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
            >
                <div class="article_item">
                    <h3 class="van-ellipsis">PullRefresh下拉刷新PullRefresh下拉刷新下拉刷新下拉刷新</h3>
                    <!-- 三图模式 -->
                    <div class="img_box">
                        <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                        <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                        <van-image class="w33" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                    </div>
                    <!-- 单图模式 -->
                    <div class="img_box">
                        <van-image class="w100" fit="cover" src="https://img.yzcdn.cn/vant/cat.jpeg"/>
                    </div>
                    <div class="info_box">
                        <span>你像一阵风</span>
                        <span>8评论</span>
                        <span>10分钟前</span>
                        <span class="close"><van-icon name="cross"></van-icon></span>
                    </div>
                </div>
            </van-cell>
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
.article_item{
  h3{
    font-weight: normal;
    line-height: 2;
  }
  .img_box{
    display: flex;
    justify-content: space-between;
    .w33{
      width: 33%;
      height: 90px;
    }
    .w100{
      width: 100%;
      height: 180px;
    }
  }
  .info_box{
    color: #999;
    line-height: 2;
    position: relative;
    font-size: 12px;
    span{
      padding-right: 10px;
      &.close{
        border: 1px solid #ddd;
        border-radius: 2px;
        line-height: 15px;
        height: 12px;
        width: 16px;
        text-align: center;
        padding-right: 0;
        font-size: 8px;
        position: absolute;
        right: 0;
        top: 7px;
      }
    }
  }
}
</style>

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
                :key="article.art_id.toString()"
            >
                <div class="article_item">
                    <h3 class="van-ellipsis">{{article.title}}</h3>
                    <!-- 三图模式 -->
                    <div class="img_box" v-if="article.cover.type===3">
                        <van-image class="w33" fit="cover" :src="article.cover.images[0]"/>
                        <van-image class="w33" fit="cover" :src="article.cover.images[1]"/>
                        <van-image class="w33" fit="cover" :src="article.cover.images[2]"/>
                    </div>
                    <!-- 单图模式 -->
                    <div class="img_box" v-if="article.cover.type===1">
                        <van-image class="w33" fit="cover" :src="article.cover.images[0]"/>
                    </div>
                    <div class="info_box">
                        <span>{{article.aut_name}}</span>
                        <span>{{article.comm_count}}评论</span>
                        <span>{{article.pubdate}}</span>
                        <span class="close"><van-icon name="cross"></van-icon></span>
                    </div>
                </div>
            </van-cell>
        </van-list>
      </van-pull-refresh>
    </div>
</template>

<script>
import { getArticles } from '@/api/article'
export default {
  name: 'article-list',
  data () {
    return {
      downLoading: false, // 是否开启下拉刷新状态
      upLoading: false, // 是否开启上拉加载
      finished: false, // 是否完成全部加载
      articles: [], // 定义一个数组来接收上拉加载的数据
      refreshSuccessText: '', //
      timestamp: null // 定义一个时间戳，发数据的时候用
    }
  },
  // 对象形式接收
  props: {
    channel_id: {
      type: Number, /// 接收的类型
      required: true, // 要求props必须传
      default: null // 给props一个默认值
    }
  },
  methods: {
    // van-list组件当你的组件内容距离底部超过一定长度的时候就会再调用onload
    async onLoad () {
      await this.$sleep()// 等待sleep resolve
      /* setTimeout(() => {
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
      }, 1000) */
      // 真实的数据请求
      // 第一次加载，时间戳是空的 所以传当前时间
      console.log('1')
      console.log({ timestamp: this.timestamp || Date.now(), channel_id: this.channel_id })
      const data = await getArticles({ timestamp: this.timestamp || Date.now(), channel_id: this.channel_id })
      this.articles.push(...data.results)// push只能push一个
      this.upLoading = false // 关闭状态
      // 判断历史时间戳。如果有历史。表示我还可以继续看，否则不看了
      if (data.pre_timestamp) {
        this.timestamp = data.pre_timestamp
      } else {
        // 否则认为没有历史了，木有必要继续加载了
        this.finished = true
      }
    },
    async onRefresh () {
      await this.$sleep()// 等待sleep resolve
      // 下拉刷新
      /* console.log('下拉刷新')
      setTimeout(() => {
        let arr = Array.from(Array(10), (value, index) => '追加' + index + 1)
        this.articles.unshift(...arr)
        this.downLoading = false
        this.refreshSuccessText = `更新了${arr.length}`
      }, 1000) */
      // 下拉刷新永远获取最新的数据
      const data = await getArticles({ timestamp: Date.now(), channel_id: this.channel_id })
      // 有可能最新的没有推荐数据
      if (data.results.length) {
        // 如果>0 替换articles
        this.articles = data.results
        // 假如你之前已经将上拉加载设置finished设置成true
        // 表示我们还需要继续往下拉
        this.finished = false
        // 注意我们依然需要获取此次的历史时间戳
        this.timestamp = data.pre_timestamp
        // 提示
        this.refreshSuccessText = `更新了${data.results.length}`
        this.downLoading = false
      } else {
        // 如果没有更新数据 什么都不需要变化
        this.refreshSuccessText = `暂无数据更新，已是最新数据`
        this.downLoading = false
      }
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

<template>
  <div class="container">
    <van-tabs swipeable v-model="activeIndex">
      <van-tab :title="channel.name" v-for="channel in channels" :key="channel.id" >
        <!-- 这个div设置了滚动条 目的是给后面做阅读记忆留下伏笔 -->
        <!-- 阅读记忆=>看文章看到一半滑到一半回来还是原来看的位置 -->
        <!-- 如果要监听子组件的事件。就应该再子组件的标签上写监听 -->
        <article-list :channel_id="channel.id" @showAction="openMoreAction"></article-list>
      </van-tab>
    </van-tabs>
    <span class="bar_btn">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 放置弹层 -->
    <van-popup v-model="showMoreAction" :style=" {width:'80%'}">
      <more-action @dislike="dislike"></more-action>
    </van-popup>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
import { dislikeArticle } from '@/api/article'
import MoreAction from './components/more-action'
import { getMyChannels } from '@/api/channels'
import ArticleList from './components/article-list'
export default {
  name: 'home',
  data () {
    return {
      activeIndex: 0,
      channels: [], // 接收频道数据
      showMoreAction: false,
      artId: null// 用来接收文章id
    }
  },
  components: {
    ArticleList,
    MoreAction
  },
  methods: {
    async getMyChannels () {
      let data = await getMyChannels()
      this.channels = data.channels
    },
    openMoreAction (artId) {
      // 监听子组件触发的事件 打开弹层
      this.showMoreAction = true
      this.artId = artId // 接收不喜欢的id
    },
    async dislike () {
      // 调用不喜欢接口

      try {
        await dislikeArticle({ target: this.artId })
        this.$znotify({ type: 'success', message: '操作成功' })
        // 触发一个事件 发出一个广播 听到广播的文章列表删除对应的数据
        eventBus.$emit('delArticle', this.artId, this.channels[this.activeIndex].id)
      } catch (error) {
        this.$znotify({ type: 'danger', message: '操作失败' })
      }
      this.showMoreAction = false
    }
  },
  created () {
    this.getMyChannels()
  }
}
</script>

<style lang="less" scoped>
.van-tabs {
  height: 100%;
  display: flex;
  flex-direction: column;
  /deep/ .van-tabs__wrap {
    height: 36px;
    padding-right: 36px;
    .van-tab {
      line-height: 36px;
    }
    .van-tabs__line {
      background-color: #3296fa;
      height: 2px;
    }
  }
  /deep/ .van-tabs__content{
    flex: 1;
    overflow: hidden;
  }
  /deep/ .van-tab__pane{
    height: 100%;
    .scroll-wrapper{
      height: 100%;
      overflow-y: auto;
    }
  }
}
.bar_btn {
  width: 36px;
  height: 35px;
  position: absolute;
  top: 0;
  right: 0;
  &::before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 999;
    box-shadow: 0 0 10px #999;
    transform: scale(1, 0.6);
  }
  .van-icon-wap-nav {
    width: 100%;
    height: 100%;
    background: #fff;
    text-align: center;
    line-height: 35px;
    position: relative;
    z-index: 1000;
    &::before {
      font-size: 20px;
    }
  }
}
</style>

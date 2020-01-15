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
    <!-- 显示编辑频道的图标 -->
    <span class="bar_btn" @click="showChannelEdit=true">
      <van-icon name="wap-nav"></van-icon>
    </span>
    <!-- 放置弹层 -->
    <van-popup v-model="showMoreAction" :style=" {width:'80%'}">
      <!-- report 事件中的第一个参数$event实际上就是moreAction 传出的参数 -->
      <more-action @dislike="dislikeOrReport($event,'dislike')" @report="dislikeOrReport($event,'report')"></more-action>
    </van-popup>
    <!-- 编辑频道 -->
    <van-action-sheet :round="false" v-model="showChannelEdit" title="编辑频道">
      <!-- 频道编辑组件 -->
      <channel-edit @addChannel="addChannel"  @delChannel="delChannel" :activeIndex="activeIndex" :channels="channels" @selectChannel="selectChannel"></channel-edit>
    </van-action-sheet>
  </div>
</template>

<script>
import ChannelEdit from './components/channel-edit'
import eventBus from '@/utils/eventBus'
import { dislikeArticle, reportArticle } from '@/api/article'
import MoreAction from './components/more-action'
import { getMyChannels, delChannel, addChannel } from '@/api/channels'
import ArticleList from './components/article-list'
export default {
  name: 'home',
  data () {
    return {
      activeIndex: 0,
      channels: [], // 接收频道数据
      showMoreAction: false,
      artId: null, // 用来接收文章id
      showChannelEdit: false
    }
  },
  components: {
    ArticleList,
    MoreAction,
    ChannelEdit
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
    // async dislike () {
    //   // 调用不喜欢接口

    //   try {
    //     await dislikeArticle({ target: this.artId })
    //     this.$znotify({ type: 'success', message: '操作成功' })
    //     // 触发一个事件 发出一个广播 听到广播的文章列表删除对应的数据
    //     eventBus.$emit('delArticle', this.artId, this.channels[this.activeIndex].id)
    //   } catch (error) {
    //     this.$znotify({ type: 'danger', message: '操作失败' })
    //   }
    //   this.showMoreAction = false
    // },
    // async report (type) {
    //   try {
    //     // 调用举报文章的接口
    //     await reportArticle({ target: this.artId, type: type })
    //     this.$znotify({
    //       type: 'success',
    //       message: '操作成功'
    //     })
    //     this.showMoreAction = false
    //     // 触发一个事件 发出一个广播 听到广播的文章列表删除对应的数据
    //     eventBus.$emit('delArticle', this.artId, this.channels[this.activeIndex].id)
    //   } catch (error) {
    //     this.$znotify({
    //       type: 'danger',
    //       message: '操作失败'
    //     })
    //   }
    // },
    async dislikeOrReport (params, operateType) {
      try {
        // operateType 有可能是report 或者dislike
        operateType === 'dislike' ? await dislikeArticle({ target: this.artId }) : await reportArticle({ target: this.artId, type: params })
        this.$znotify({
          type: 'success',
          message: '操作成功'
        })
        this.showMoreAction = false
        // 触发一个事件 发出一个广播 听到广播的文章列表删除对应的数据
        eventBus.$emit('delArticle', this.artId, this.channels[this.activeIndex].id)
      } catch (error) {
        this.$znotify({
          type: 'danger',
          message: '操作失败'
        })
      }
    },
    selectChannel (channelId) {
      // 要选择切换到的对应的频道，关闭弹层
      let index = this.channels.findIndex((item) => { return item.id === channelId }) // 获取切换频道的索引
      this.activeIndex = index // 将tab激活标签切换到对应的标签下
      this.showChannelEdit = false // 关闭弹层
    },
    // 删除频道
    async  delChannel (id) {
      try {
        await delChannel(id)
        // 删除成功后
        // 移除data中的channels的id
        let index = this.channels.findIndex(item => item.id === id)
        if (index <= this.activeIndex) {
          // 如果删除的频道在激活频道之前或者就是当前激活频道，要把我们的激活索引往前挪一位
          this.activeIndex = this.activeIndex - 1
        }
        if (index > -1) {
          // 找到了
          this.channels.splice(index, 1)// 移除当前频道
          // 判断一下删除的索引和激活的索引
        }
      } catch (error) {
        this.$znotify({ type: 'danger', message: '操作失败' })
      }
    },
    async addChannel (channel) {
      await addChannel(channel)
      this.channels.push(channel)// 这一步是修改data中的数据
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
.van-action-sheet {
  max-height: 100%;
  height: 100%;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
}
</style>

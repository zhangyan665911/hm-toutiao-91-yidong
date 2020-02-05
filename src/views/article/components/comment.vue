<template>
<!-- 评论列表组件 -->
  <div class="comment">
      <!-- 上拉加载功能 -->
      <!-- 用户进入文章列表就自动加载评论 -->
    <van-list @load="onLoad" v-model="loading" :finished="finished" finished-text="没有更多了">
      <div class="item van-hairline--bottom van-hairline--top" v-for="comment in comments" :key="comment.com_id.toString()">
        <van-image
          round
          width="1rem"
          height="1rem"
          fit="fill"
          :src="comment.aut_photo"
        />
        <div class="info">
          <p>
            <span class="name">{{comment.aut_name}}</span>
            <span style="float:right">
              <span class="van-icon van-icon-good-job-o zan"></span>
              <span class="count">{{comment.like_count}}</span>
            </span>
          </p>
          <p>{{comment.content}}</p>
          <p>
            <span class="time">{{comment.pubdate | relTime}}</span>&nbsp;
            <van-tag plain @click="openReply(comment.com_id)">{{comment.reply_count}} 回复</van-tag>
          </p>
        </div>
      </div>
    </van-list>
    <!-- 给v-model一个修饰符.trim去掉前后空格 -->
    <div class="reply-container van-hairline--top">
      <van-field v-model.trim="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span class="submit" @click="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    <!-- 回复列表组件 -->
    <!-- 当退出之后把评论id制成空 -->
    <van-action-sheet @closed="reply.commentId=null" :round="false" v-model="showReply" class="reply_dailog" title="回复评论">
      <!-- 回复列表组件 加载状态 finished finished-text -->
      <!-- immediate-check控制当前van-list组件是否主动检查滚动 -->
      <van-list @load="getReply()" :immediate-check="false" v-model="reply.loading" :finished="reply.finished" finished-text="没有更多了">
        <div class="item van-hairline--bottom van-hairline--top" v-for="reply in reply.list" :key="reply.com_id.toString()">
          <!-- 用户头像 -->
          <van-image round width="1rem" height="1rem" fit="fill" :src="reply.aut_photo" />
          <div class="info">
            <!-- 用户名 -->
            <p><span class="name">{{reply.aut_name}}</span></p>
            <!-- 评论内容 -->
            <p>{{reply.content}}</p>
            <p><span class="time">{{reply.pubdate|relTime}}</span></p>
          </div>
        </div>
      </van-list>
      <div class="reply-container van-hairline--top">
      <van-field v-model="value" placeholder="写评论...">
        <van-loading v-if="submiting" slot="button" type="spinner" size="16px"></van-loading>
        <span @click="submit" class="submit" v-else slot="button">提交</span>
      </van-field>
    </div>
    </van-action-sheet>
  </div>

  <!-- 都不输入框 -->
</template>

<script>
import { getComments, commentOrReply } from '@/api/article'
export default {
  data () {
    return {
      // 上拉加载中
      loading: false,
      // 全部加载完毕
      finished: false,
      // 输入的内容
      value: '',
      // 控制提交中状态数据
      submiting: false,
      // 一个属性用来存放评论属性
      comments: [], // 评论列表的数据
      // 一个属性用来存放offset
      offset: null, // 如果为空表示从第一页开始
      showReply: false,
      reply: {
        // 专门用reply这个对象存放回复相关的数据
        loading: false, // 是回复列表组件的状态
        finished: false, // 是回复列表组件的结束状态
        list: [], // 用于存放当前弹出的关于某个评论的回复列表
        offset: null, // 获取评论的评论的分页依据
        commentId: null// 用来存放评论的id

      }

    }
  },
  methods: {
    async submit () {
      // 提交评论的方法
      if (!this.value) {
        // 如果他为空
        return false
        // 如果当前评论内容为空就会立刻返回
      }
      this.submiting = true// 控制提交状态，控制用户单位时间内评论的数据次数
      await this.$sleep()// 强制等待500ms
      try {
        // this.$sleep()
      // 评论有两种场景
      // 一种是对文章进行评论，一种是对评论进行评论

        // 如果不为空
        // 怎么区分是对文章评论还是对评论进行评论
        console.log('评论了')
        const data = await commentOrReply({
          content: this.value,
          target: this.reply.commentId ? this.reply.commentId.toString() : this.$route.query.articleId, // 要么是文章id要么是评论id
          art_id: this.reply.commentId ? this.$route.query.articleId : null// 如果是对文章进行评论就不需要传参数
        })
        // 将评论数据呈现在视图上
        if (this.reply.commentId) {
          // 对评论进行评论
          this.reply.list.unshift(data.new_obj)
          // 如果对评论的评论后应该找到该评论评对评论的回复次数+1
          // find
          const comment = this.comments.find(item => item.com_id.toString() === this.reply.commentId.toString())
          comment && comment.reply_count++
        } else {
          // 对文章进行评论
          this.comments.unshift(data.new_obj)
        }
      } catch (error) {
        this.$znotify({
          type: 'danger',
          message: '评论失败'
        })
      }
      this.submiting = false
      this.value = ''// 清空输入框
    },
    openReply (commentId) {
      this.showReply = true// 弹出面板
      // 进行若干操作
      this.reply.commentId = commentId
      // 关闭van-list上拉加载
      this.reply.list = [] // 清空我们原有的数据
      this.reply.offset = null // 重置回复的偏移量
      this.reply.finished = false// 设置成原始状态
      this.reply.loading = true// 打开加载状态，因为这个时候没有了自动检查
      // 开始加载第一页的数据
      this.getReply()
    },
    async getReply () {
      // 获取评论的评论就是获取回复的方法
      // 加载逻辑
      let data = await getComments({
        type: 'c', // 获取评论的评论
        offset: this.reply.offset, // 获取评论的评论的偏移量
        source: this.reply.commentId.toString()
      })
      // console.log(data)
      this.reply.list.push(...data.results)// 将评论的评论加到数据尾部
      this.reply.loading = false// 评论的评加载状态关闭
      this.reply.finished = data.end_id === data.last_id// 表示没有数据可以加载了
      if (!this.reply.finished) {
        // 表示还有数据没有加载完
        this.reply.offset = data.last_id
        // 把当前页的最后一个id给偏移量作为请求下一页的参数依据
      }
    },
    async onLoad () {
      console.log('获取评论列表')
      // 调用getComments
      var data = await getComments({
        type: 'a', // 获取类型
        offset: this.offset,
        source: this.$route.query.articleId// 文章的id
      })
      // console.log(data)
      this.comments.push(...data.results)// 将数据添加到当前评论列表的尾部
      this.loading = false// 关闭正在上拉加载的状态
      this.finished = data.last_id === data.end_id
      if (!this.finished) {
        // 如果finished等于false
        // 表示last_id！=data.end_id
        // 表示还有下一页数据
        // 要获取下一页的数据的时候要修改offset来找下一页数据
        this.offset = data.last_id
      }
    }
  }
}
</script>

<style lang='less' scoped>
.comment {
  margin-top: 10px;
  /deep/ .item {
    display: flex;
    padding: 10px 0;
    .info {
      flex: 1;
      padding-left: 10px;
      .name{
        color:#069;
      }
      .zan{
        vertical-align:middle;
        padding-right:2px;
      }
      .count{
        vertical-align:middle;
        font-size:10px;
        color: #666;
      }
      .time{
        color: #666;
      }
      p {
        padding: 5px 0;
        margin: 0;
      }
    }
  }
  /deep/ .van-button:active::before {
    background: transparent;
  }
}
.reply-container {
  position: fixed;
  left: 0;
  bottom: 0;
  height: 44px;
  width: 100%;
  background: #f5f5f5;
  z-index: 9999;
  .submit {
    font-size: 12px;
    color: #3296fa;
  }
}
.reply_dailog {
  height: 100%;
  max-height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .van-action-sheet__header {
    background: #3296fa;
    color: #fff;
    .van-icon-close {
      color: #fff;
    }
  }
  .van-action-sheet__content{
    flex: 1;
    overflow-y: auto;
    padding: 0 10px 44px;
  }
}
</style>

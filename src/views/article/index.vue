<template>
   <div class='container'>
    <van-nav-bar fixed :title="article.title" left-arrow @click-left="$router.back()" />
    <div class="detail">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="1rem" height="1rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate | relTime}}</p>
        </div>
        <van-button :loading="followLoading" @click="follow()" round size="small" type="info" >{{article.is_followed ? '已关注' :'+ 关注'}}</van-button>
      </div>
      <div class="content">
        <p v-html="article.content"></p>
      </div>
      <div class="zan">
        <van-button round size="small" :class="{active:article.attitude===1}" plain icon="like-o">点赞</van-button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" :class="{active:article.attitude===0}" plain icon="delete">不喜欢</van-button>
      </div>
      <!-- 放置我们的评论组件 -->
      <comment></comment>
    </div>
  </div>
</template>

<script>
import { followUser, unFollowUser } from '@/api/user'
import { getArticleInfo } from '@/api/article'
import Comment from './components/comment'
export default {
  name: 'article-i',
  data () {
    return {
      article: {}, // 接收文章的数据
      followLoading: false // 默认是关闭的
    }
  },
  created () {
    this.getArticleInfo()
  },
  components: {
    Comment
  },
  methods: {
    async getArticleInfo () {
      let { articleId } = this.$route.query
      this.article = await getArticleInfo(articleId)
    },
    // 关注或者取消关注
    async follow () {
      try {
        this.followLoading = true
        await this.$sleep()
        if (this.article.is_followed) {
        // 应该调用取消关注
          await unFollowUser(this.article.aut_id)
        } else {
        // 没有关注要加专注
          await followUser({ target: this.article.aut_id })
        }
        this.article.is_followed = !this.article.is_followed
        this.followLoading = false
      } catch (error) {
        this.$znotify({ type: 'danger', message: '操作失败' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.detail {
  padding: 46px 10px 44px;
  .title {
    font-size: 18px;
    line-height: 2;
  }
  .zan{
    text-align: center;
    padding: 10px 0;
    .active{
      border-color:red;
      color: red;
    }
  }
  .author {
    padding: 10px 0;
    display: flex;
    position:sticky;
    top:46px;
    background-color: #fff;
    z-index: 3;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.5;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    padding: 20px 0;
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img{
      max-width:100%;
      background: #f9f9f9;
    }
    /deep/ code{
      white-space: pre-wrap;
    }
  }
}
</style>

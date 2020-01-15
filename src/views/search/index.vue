<template>
  <div class="container">
    <!-- 搜索组件一级路由   返回上一个页面-->
    <van-nav-bar left-arrow title="搜索中心" @click-left="$router.back()"></van-nav-bar>
    <!-- 导航 -->
    <!-- 搜索框 -->
    <!-- 去除空格 -->
    <van-search @search="onSearch" v-model.trim="q"  placeholder="请输入搜索关键词" shape="round" />
    <!-- 联想搜索 -->
    <van-cell-group class="suggest-box" v-if="q">
      <van-cell icon="search">
        <span>j</span>ava
      </van-cell>
    </van-cell-group>
    <!-- 历史记录 -->
    <!-- 只有当有历史记录的时候才会显示盒子 -->
    <div class="history-box" v-if="historyList.length">
      <div class="head">
        <span>历史记录</span>
        <!-- 清空所有历史 -->
        <van-icon name="delete" @click="clear"></van-icon>
      </div>
      <van-cell-group>
        <!-- item是一个唯一的 -->
        <van-cell v-for="(item,index) in historyList" :key="item" @click="toResult(item)">
          <a class="word_btn">{{item}}</a>
          <!-- 事件修饰符 事件.stop -->
          <van-icon class="close_btn" slot="right-icon" name="cross" @click.stop="delHistory(index)" />
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script>
const key = 'hm-91-toutiao-history'
export default {
  name: 'search',
  data () {
    return {
      q: '',
      historyList: []// 存放历史记录的数据
    }
  },
  created () {
    this.historyList = JSON.parse(localStorage.getItem(key) || '[]')
  },
  methods: {
    delHistory (index) {
      this.historyList.splice(index, 1)
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    toResult (text) {
      this.$router.push({ path: '/search/result', query: { q: text } })
    },
    clear () {
      // 清空列表
      this.historyList = []
      localStorage.setItem(key, JSON.stringify(this.historyList))
    },
    onSearch () {
      // 在跳转到搜索结果之前应该把我们当前的搜索关键字写到historylist
      if (!this.q) {
        // 如果为空,没有必要往下走
        return
      }
      // 如果不为空，要将this.q加入到historyList
      let obj = new Set(this.historyList)// 生成一个set变量
      obj.add(this.q)
      this.historyList = Array.from(obj)// 将set转回数组
      localStorage.setItem(key, JSON.stringify(this.historyList)) // 重新写入缓存
      this.$router.push({ path: '/search/result', query: { q: this.q } })
    }
  }
}
</script>

<style lang='less' scoped>
.history-box {
  padding: 0 20px;
  .head{
    line-height: 36px;
    color: #999;
    .van-icon{
      font-size: 16px;
      float: right;
      margin-top: 10px;;
    }
  }
  .van-cell{
    padding: 10px 0;
  }
  .word_btn{
    color:#3296fa;
  }
  .close_btn{
    margin-top:5px;
    color: #999;
  }
}
.suggest-box{
  /deep/ .van-cell{
    padding: 10px 20px;
    color: #999;
    p{
      span{
        color: red;
      }
    }
  }
}
</style>

<template>
  <div class="container">
    <van-nav-bar fixed title="搜索结果" left-arrow @click-left="$router.back()" />

      <van-list v-model="upLoading" :finished="finished" @load="onLoad">
        <van-cell-group>
          <!-- art_id有可能是大数字 -->
          <van-cell v-for="item in articles" :key="item.art_id.toString()">
            <div class="article_item">
              <h3 class="van-ellipsis">{{item.title}}</h3>
              <div class="img_box" v-if="item.cover.type===3">
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[0]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[1]" />
                <van-image lazy-load class="w33" fit="cover" :src="item.cover.images[2]"/>
              </div>
              <div class="img_box" v-if="item.cover.type===1">
                <van-image lazy-load class="w100" fit="cover" :src="item.cover.images[0]" />
              </div>
              <div class="info_box">
                <span>{{item.aut_name}}</span>
                <span>{{item.comm_count}}评论</span>
                <span>1{{item.pubdate | relTime}}</span>
              </div>
            </div>
          </van-cell>
        </van-cell-group>
      </van-list>
  </div>
</template>

<script>
import { searchArticle } from '@/api/article'
export default {
  name: 'result',
  data () {
    return {
      upLoading: false, // 是否开启上拉加载状态
      finished: false, // 是否已经完成了全部的加载
      articles: [], // 存放文章的列表
      page: {
        page: 1, // 当前页码
        per_page: 10// 表示每页请求10条
      }
    }
  },
  methods: {
    async onLoad () {
      console.log('开始加载数据')
      let { q } = this.$route.query// 从地址栏解析出查询参数
      let data = await searchArticle({ ...this.page, q })
      // 上拉加载的业务 =>追加
      this.articles.push(...data.results)
      this.upLoading = false // 手动关闭加载状态
      // 根据当前返回的数组的长度，如果当前的长度为0
      if (data.results.length) {
        // 不为0
        this.page.page++// 将页码加1
      } else {
        this.finished = true
      }
    }
  }

}
</script>

<style lang="less" scoped>
.container {
  padding-top: 46px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
}
.article_item {
  h3 {
    font-weight: normal;
    line-height: 2;
  }
  .img_box {
    display: flex;
    justify-content: space-between;
    .w33 {
      width: 33%;
      height: 90px;
    }
    .w100 {
      height: 180px;
      width: 100%;
    }
  }
  .info_box {
    color: #999;
    line-height: 2;
    position: relative;
    span {
      padding-right: 10px;
    }
  }
}
</style>

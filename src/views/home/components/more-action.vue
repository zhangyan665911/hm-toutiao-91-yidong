<template>
    <div class="more-action">
        <van-cell-group v-if="!isReport">
            <!-- 点击按钮要触发父组件去调用不感兴趣接口 -->
            <van-cell @click="$emit('dislike')">不感兴趣</van-cell>
            <van-cell is-link @click="isReport=true">反馈垃圾内容</van-cell>
            <van-cell>拉黑作者</van-cell>
        </van-cell-group>
        <van-cell-group v-else>
            <van-cell icon="arrow-left" @click="isReport=false">返回</van-cell>
            <!-- 点击举报按钮触发父组件 去调用举报接口 -->
            <van-cell v-for="item in reports" :key="item.value"  @click="$emit('report',item.value)">{{item.label}}</van-cell>

        </van-cell-group>
    </div>

</template>

<script>
import eventBus from '@/utils/eventBus'
import { reports } from '@/api/constants'
export default {
  data () {
    return {
      isReport: false,
      reports
    }
  },
  created () {
    eventBus.$on('delArticle', () => {
      this.isReport = false
    })
  }
}
</script>

<style lang="less" scoped>
.van-popup {

  border-radius: 4px;
}
</style>

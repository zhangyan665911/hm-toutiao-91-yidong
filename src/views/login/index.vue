<template>
  <div class="container">
    <van-nav-bar title="登录" left-arrow @click-left="$router.back()" ></van-nav-bar>
    <van-cell-group>
      <van-field v-model="loginForm.mobile" label="手机号" @blur="checkMobile" :error-message="errorMsg.mobile" placeholder="请输入手机号" required></van-field>
      <van-field v-model="loginForm.code" label="验证码" placeholder="请输入验证码" @blur="checkCode" required :error-message="errorMsg.code">
        <van-button slot="button" size="small" type="primary">发送验证码</van-button>
      </van-field>
    </van-cell-group>
    <div class="btn-box">
      <van-button type="info" block round size="small" @click="login">登录</van-button>
    </div>

  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        mobile: '13911111111',
        code: '246810'
      },
      // 专门提示错误信息的
      errorMsg: {
        mobile: '',
        code: ''
      }
    }
  },
  methods: {
    checkMobile () {
      // 判断为空
      if (!this.loginForm.mobile) {
        this.errorMsg.mobile = '手机号不能为空'
        return false
      } else if (!/^1[3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errorMsg.mobile = '手机号格式不正确'
        return false
      }
      this.errorMsg.mobile = ''
      return true
    },
    checkCode () {
      if (!this.loginForm.code) {
        this.errorMsg.code = '验证码不能为空'
        return false
      } else if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errorMsg.code = '验证码必须为6位'
        return false
      }
      this.errorMsg.code = ''
      return true
    },
    login () {
      if (this.checkMobile() && this.checkCode()) {
        // 发送请求
        // 提示消息 表示登录成功
        console.log('校验通过')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box{
  padding:20px;
}
</style>

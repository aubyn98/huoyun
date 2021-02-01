<template>
  <div class="login">
    <div class="loginContent">
      <div class="loginTitle">登录</div>
      <div class="inputBox">
        <span>账户</span>
        <div>
          <i class="el-icon-user"></i>
          <input type="text" placeholder="请输入账户" v-model="form.userName" />
        </div>
      </div>
      <div class="inputBox">
        <span>密码</span>
        <div>
          <i class="el-icon-lock"></i>
          <input
            type="password"
            placeholder="请输入密码"
            v-model="form.password"
            @keypress.enter="login"
          />
        </div>
      </div>
      <div class="btnBox">
        <div class="btnbg"></div>
        <div class="btn" @click="login">登录</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        userName: '',
        password: ''
      }
    }
  },
  methods: {
    login() {
      switch ('') {
        case this.form.userName:
          this.$message.error('账号不能为空！')
          return
        case this.form.password:
          this.$message.error('密码不能为空！')
          return
      }
      this.$req('/login', this.form).then(res => {
        if (res) {
          if (res.status === 1) {
            const account = Object.assign(
              {
                position: res.position,
                administrator: res.administrator,
                qx: res.qx.split(',')
              },
              this.form,
              { isLogin: true }
            )
            sessionStorage.setItem('account', JSON.stringify(account))
            this.$store.commit('changeAccount', account)
            this.$message({
              message: '登录成功！',
              type: 'success'
            })
            this.$req('/base', {}, { method: 'get' }).then(res => {
              if (res && res.res && res.res.length > 0) {
                localStorage.setItem('corporate', JSON.stringify(res.res[0]))
              }
            })
            this.$router.push({ name: 'Work' })
            return
          } else {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          }
          sessionStorage.removeItem('account')
        }
      })
    }
  },
  components: {}
}
</script>

<style lang="scss">
.login {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url("../assets/loginBg.jpg") no-repeat center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .loginContent {
    width: 500px;
    padding: 55px;
    background: #fff;
    border-radius: 10px;
    overflow: hidden;

    .btnBox {
      // position: relative;
      margin: 60px 0 0;
      width: 100%;
      overflow: hidden;
      position: relative;
      z-index: 1;
      border-radius: 25px;
      display: block;
      cursor: pointer;

      .btnbg {
        width: 300%;
        height: 100%;
        background: #a64bf4;
        background: -webkit-linear-gradient(
          right,
          #00dbde,
          #fc00ff,
          #00dbde,
          #fc00ff
        );
        top: 0;
        left: -100%;
        transition: all 0.5s linear;
        position: absolute;
        z-index: -1;
      }
      .btnbg {
        animation: bm 3s ease-in-out infinite alternate;
      }
      @keyframes bm {
        from {
          left: -100%;
        }
        to {
          left: 0;
        }
      }
      .btn {
        font-family: "Microsoft Yahei";
        font-size: 16px;
        color: #fff;
        line-height: 1.2;
        text-transform: uppercase;
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-box;
        display: -ms-flexbox;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
        width: 100%;
        height: 50px;
        box-sizing: border-box;
      }
    }

    /* .btnBox:hover .btnbg {
            left: 0;
        } */

    .loginTitle {
      display: block;
      font-family: "Microsoft Yahei";
      font-size: 39px;
      color: #333333;
      line-height: 1.2;
      text-align: center;
      padding-bottom: 49px;
    }

    .inputBox {
      width: 100%;
      position: relative;
      border-bottom: 2px solid #d9d9d9;
      text-align: left;
      margin-bottom: 30px;

      div {
        display: flex;
        padding: 0 15px;
        box-sizing: border-box;
        .el-icon-user,
        .el-icon-lock {
          font-size: 18px;
          display: flex;
          align-items: center;
        }
      }

      span {
        font-family: "Microsoft Yahei";
        font-size: 14px;
        color: #333333;
        line-height: 1.5;
        padding-left: 7px;
      }

      input {
        font-family: "Microsoft Yahei";
        font-size: 16px;
        color: #333333;
        line-height: 1.2;
        display: block;
        width: 100%;
        height: 55px;
        background: transparent;
        padding: 0 7px 0 10px;
        outline: none;
        border: none;
      }
    }
  }
}
</style>

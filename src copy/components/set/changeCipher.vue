<template>
  <div class="changeCipher">
    <div class="cipherContent">
      <div class="inputContent">更改密码</div>
      <div class="inputContent">
        <div>请输入原密码:</div>
        <el-input placeholder="请输入原密码" v-model="oldCipher" :type="type1 ? 'password' : 'text'">
          <i
            slot="suffix"
            :class="type1 ? 'el-input__icon el-icon-view' :'el-input__icon el-icon-circle-close'"
            @click="changType('type1')"
          ></i>
        </el-input>
      </div>
      <div class="inputContent">
        <div>请输入新密码:</div>
        <el-input placeholder="请输入新密码" v-model="newCipher" :type="type2 ? 'password' : 'text'">
          <i
            slot="suffix"
            :class="type2 ? 'el-input__icon el-icon-view' :'el-input__icon el-icon-circle-close'"
            @click="changType('type2')"
          ></i>
        </el-input>
      </div>
      <div class="inputContent">
        <div>再次输入密码:</div>
        <el-input placeholder="再次输入密码" v-model="newCipher2" :type="type3 ? 'password' : 'text'">
          <i
            slot="suffix"
            :class="type3 ? 'el-input__icon el-icon-view' :'el-input__icon el-icon-circle-close'"
            @click="changType('type3')"
          ></i>
        </el-input>
      </div>
      <div class="inputContent">
        <el-button type="primary" @click="confirm">确定</el-button>
        <el-button @click="cipherHidden">取消</el-button>
      </div>
    </div>
    <div class="Mask"></div>
  </div>
</template>
<script>
/*eslint-disable */
export default {
  name:'cipherChange',
  data () {
    return {
      oldCipher: '',
      newCipher: '',
      newCipher2: '',
      type1: true,
      type2: true,
      type3: true
    }
  },
  methods: {
    changType (type) {
      switch (true) {
        case type == 'type1':
          this.type1 = !this.type1
          break
        case type == 'type2':
          this.type2 = !this.type2
          break
        case type == 'type3':
          this.type3 = !this.type3
          break
      }
    },
    cipherHidden () {
      this.$emit('cipherShowHandle')
    },
    confirm () {
      switch (true) {
        case this.oldCipher == '':
          this.$alert('请重新输入旧密码', '旧密码不能为空')
          return
          break
        case this.newCipher == '':
          this.$alert('请重新输入新密码', '新密码不能为空')
          return
          break
        case this.newCipher2 == '':
          this.$alert('请重新再次输入新密码', '再次输入的新密码不能为空')
          return
          break
        case this.newCipher == this.oldCipher:
          this.$alert('请重新输入新密码', '新密码不能与旧密码一致')
          this.newCipher = ''
          this.newCipher2 = ''
          return
          break
        case this.newCipher != this.newCipher2:
          this.$alert('请重新输入密码', '两次输入的新密码不一致')
          return
          break
        case this.newCipher.length < 3:
          this.$alert('请重新输入新密码', '密码长度不能小于3')
          return
          break
        case this.oldCipher != this.$store.state.account.password:
          this.$alert('请重新输入旧密码', '旧密码错误')
          return
          break
      }
      this.$req('/changePw', { newPassword: this.newCipher, ...this.$store.state.account }).then(res => {
        if (res && res.status === 1) {
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          sessionStorage.setItem('account',JSON.stringify(Object.assign(this.$store.state.account,{password:this.newCipher})))
          setTimeout(() => {
                this.$store.commit('changeAccount')
              }, 50)
          this.$emit('cipherShowHandle')    
        } else {
          this.$message.error(res.msg)
        }
      })
    }
  }
}
</script>
<style lang="scss">
.changeCipher {
  position: absolute;
  top: 26.5%;
  left: 30%;
  height: 47%;
  width: 40%;
  z-index: 999;
  .cipherContent {
    height: 100%;
    width: 100%;
    background-color: white;
    box-shadow: 0 0 8px #707070;
    display: flex;
    flex-direction: column;
    align-items: center;
    .inputContent:nth-child(1) {
      font-size: 22px;
      margin-top: 26px;
    }
    .inputContent:last-child {
      margin-top: 50px;
    }
    .inputContent {
      width: 80%;
      color: #535f6b;
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin: 10px;
      div {
        font-size: 18px;
      }
    }
    .el-input {
      width: 60%;
    }
    .el-button {
      width: 40%;
    }
  }
}
.Mask {
  position: fixed;
  top: 0px;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: black;
  opacity: 0.3;
  z-index: -2;
}
</style>

<template>
  <div class="page">
    <header>基础信息</header>
    <div class="pagecontent">
      <div class="saveForm" style="height:90%;width:100%;">
        <el-form
          ref="form"
          label-position="left"
          class="card"
          style="display:flex;height:98%;width:100%;padding-top:20px"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="公司名称" style="width:48%">
            <template>
              <el-input v-model="msg.corporateName" placeholder="请输入公司名称"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="英文名称" style="width:48%">
            <template>
              <el-input v-model="msg.englishName" placeholder="请输入英文名称"></el-input>
            </template>
          </el-form-item>
          <!--eslint-disable-->
          <el-form-item label="联 系 人" style="width:48%">
            <template>
              <el-input v-model="msg.contacts" placeholder="请输入联系人名称"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="电　　话" style="width:48%">
            <template>
              <el-input v-model="msg.phone" placeholder="请输入电话号码"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="手　　机" style="width:48%">
            <template>
              <el-input v-model="msg.mobilePhone" placeholder="请输入手机号码"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="传　　真" style="width:48%">
            <template>
              <el-input v-model="msg.fax" placeholder="请输入传真号码"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="网　　址" style="width:48%">
            <template>
              <el-input v-model="msg.website" placeholder="请输入网址"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="邮　　箱" style="width:48%">
            <template>
              <el-input v-model="msg.mailbox" placeholder="请输入邮箱"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="公司地址" style="width:48%">
            <template>
              <el-input v-model="msg.address" placeholder="请输入公司地址"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="注意事项" style="width:48%">
            <template>
              <el-input v-model="msg.tip" placeholder="请输入托运注意事项" type="textarea"></el-input>
            </template>
          </el-form-item>
        </el-form>
      </div>
      <div class="bottomBtn-right">
        <el-button type="success" @click="save" v-if="permission(['all'])">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  created() {
    this.get()
  },
  data() {
    return {
      msg: {
        corporateName: '',
        englishName: '',
        contacts: '',
        phone: '',
        mobilePhone: '',
        fax: '',
        website: '',
        mailbox: '',
        address: '',
        tip: ''
      }
    }
  },
  methods: {
    save() {
        this.$req('/base/update', { ...this.msg }).then(res => {
          if (res.status === 1) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
            localStorage.setItem('corporate', JSON.stringify(this.msg))
          } else {
            this.$message({
              message: '保存失败！',
              type: 'error'
            })
          }
        })
    },
    get() {
      this.$req('/base', {}, { method: 'get' }).then(res => {
        if (res && res.res && res.res.length > 0) {
          this.msg = res.res[0]
        }
      })
    }
  },
  watch: {

  }
}
</script>

<style lang="scss">
.el-textarea__inner {
  height: 100% !important;
}
</style>

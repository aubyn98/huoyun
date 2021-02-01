<template>
  <div class="page">
    <!-- <header>货运单统计</header> -->
    <div class="pagecontent">
      <div class="saveForm" style="height:90%;width:100%">
        <el-form
          ref="form"
          label-position="left"
          class="card"
          style="display:block;height:98%;width:100%"
          :label-width="$store.state.mobile ? '' : ''"
        >
          <el-form-item label="标题" style="width:100%">
            <template>
              <el-input v-model="msg.title" placeholder="请输入标题"></el-input>
            </template>
          </el-form-item>
          <el-form-item label="内容" style="height:70%;width:100%">
            <template>
              <el-input
                type="textarea"
                style="width:100%;height:100%;"
                v-model="msg.content"
                placeholder="请输入内容"
              ></el-input>
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
        id: '',
        title: '',
        content: ''
      }
    }
  },
  methods: {
    save() {
      if (!this.msg.id) {
        this.$req('/wxgz/add', { ...this.msg }).then(res => {
          if (res.status === 1) {
            this.msg.id = res.res.id
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          } else {
            this.$message({
              message: '保存失败！',
              type: 'error'
            })
          }
        })
      } else {
        this.$req('/wxgz/update', { ...this.msg }).then(res => {
          if (res.status === 1) {
            this.$message({
              message: '保存成功！',
              type: 'success'
            })
          } else {
            this.$message({
              message: '保存失败！',
              type: 'error'
            })
          }
        })
      }
    },
    get() {
      this.$req('/wxgz', {}, { method: 'get' }).then(res => {
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

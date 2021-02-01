<template>
  <div class="changeCipher">
    <div class="cipherContent">
      <div class="inputContent">设置连接打印的电脑IP</div>
      <div class="inputContent">
        <div>IP:</div>
        <el-input placeholder="请输入要连接的IP" v-model="ip" type="text"></el-input>
      </div>
      <div class="inputContent">
        <el-button type="primary" @click="confirm">确定</el-button>
      </div>
    </div>
    <div class="Mask"></div>
  </div>
</template>
<script>
/*eslint-disable */
export default {
  name: "cipherChange",
  data() {
    return {
      ip: localStorage.getItem('IP') || "http://127.0.0.1"
    };
  },
  methods: {
    cipherHidden() {
      this.$emit("ipShowHandle");
    },
    confirm() {
      if (this.ip === "") {
        return this.$message.error("IP不能为空！");
      }
      localStorage.setItem("IP", this.ip);
      this.$message.success("设置成功！");
      this.$emit("ipShowHandle");
    }
  }
};
</script>
<style lang="scss">
</style>

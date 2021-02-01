<template>
  <div class="bluetoothPage">
    <div class="cipherContent">
      <div class="inputContent">连接蓝牙打印机</div>
      <div class="inputContent">
        <el-button type="primary" @click="search">搜索设备</el-button>
      </div>
      <div class="inputContent">
        <div style="width:100%;display:flex">
            <p>aaa</p>
            <el-button type="primary" size="mini" @click="connect">连接</el-button>
        </div>
      </div>
      <div class="inputContent">
        <el-button type="primary" @click="cancel">取消</el-button>
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
      connect(){},
    cancel() {
      this.$emit("ipShowPrinter");
    },
    confirm() {
      if (this.ip === "") {
        return this.$message.error("IP不能为空！");
      }
      localStorage.setItem("IP", this.ip);
      this.$message.success("设置成功！");
      this.$emit("ipShowPrinter");
    }
  }
};
</script>
<style lang="scss">
.bluetoothPage {
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
